import { Injectable, Logger } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  CAMPAIGN_TYPE,
  CAMPAIGN_IS_ACTIVE,
  CAMPAIGN_STATUS,
} from '@lib/campaign'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { Brackets, LessThanOrEqual } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { CommonService } from '@lib/common'
import { KafkaService } from '@lib/kafka/kafka.service'
import { ConfigService } from '@nestjs/config'
import { MissionService } from '@lib/mission'
import { plainToInstance } from 'class-transformer'
import {
  CheckinCampaignDto,
  CHECKIN_MISSION_STATUS,
  CheckinMissionDto,
} from './dto/api-campaign-checkin.dto'
import { UserRewardHistoryService } from '@lib/user-reward-history'
import * as moment from 'moment'
import { UserCheckinLogService } from '@libs/user-checkin-log'

@Injectable()
export class ApiCampaignService {
  private readonly logger = new Logger(ApiCampaignService.name)

  constructor(
    private readonly campaignService: CampaignService,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    private readonly missionService: MissionService,
    private readonly rewardHistoryService: UserRewardHistoryService,
    private readonly commonService: CommonService,
    private readonly userCheckinLogService: UserCheckinLogService,
  ) {}

  async findPublicCampaigns(
    apiCampaignFilterDto: ApiCampaignFilterDto,
    userId: string,
  ) {
    const limit =
      (Number(apiCampaignFilterDto.limit) > 100
        ? 100
        : Number(apiCampaignFilterDto.limit)) || 20
    const page = apiCampaignFilterDto.page || 1
    const options: IPaginationOptions<CustomPaginationMetaTransformer> = {
      page,
      limit,
      metaTransformer: (
        pagination: IPaginationMeta,
      ): CustomPaginationMetaTransformer =>
        new CustomPaginationMetaTransformer(
          pagination.totalItems,
          pagination.itemsPerPage,
          pagination.currentPage,
        ),
      route: '/campaigns',
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const queryBuilder = this.campaignQueryBuilder(apiCampaignFilterDto, userId)
    const result = await this.campaignService.getPaginate(
      options,
      queryBuilder,
      false,
    )
    CommonService.customLinks(result.links)
    return {
      pagination: result.meta,
      data: result.items,
      links: CommonService.customLinks(result.links),
    }
  }

  private campaignQueryBuilder(
    campaignFilter: ApiCampaignFilterDto,
    userId: string,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.leftJoin(
      'mission_user',
      'mission_user',
      'mission_user.campaign_id = campaign.id AND mission_user.user_id = ' +
        userId +
        ' AND (SELECT missions.is_active FROM missions WHERE missions.id = mission_user.mission_id AND is_active = true LIMIT 0,1) IS NOT NULL',
    )
    queryBuilder.select([
      'SUM(mission_user.success_count) AS success_count',
      'campaign.id',
      'campaign.description',
      'campaign.descriptionJa',
      'campaign.title',
      'campaign.titleJa',
      'campaign.startDate',
      'campaign.endDate',
      'campaign.notificationLink',
      'campaign.notificationLinkJa',
      'campaign.campaignImage',
      'campaign.campaignImageJa',
      'campaign.status',
    ])
    queryBuilder.where('campaign.type = :type ', {
      type: CAMPAIGN_TYPE.DEFAULT,
    })
    queryBuilder.andWhere('campaign.isActive = :is_active ', {
      is_active: CAMPAIGN_IS_ACTIVE.ACTIVE,
    })

    // Only show running campaign or completed by user
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('campaign.status = ' + CAMPAIGN_STATUS.RUNNING).orWhere(
          'success_count > 0',
        )
      }),
    )

    queryBuilder.groupBy('campaign.id')

    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && CAMPAIGN_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${CAMPAIGN_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(CAMPAIGN_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${CAMPAIGN_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${ApiCampaignService.escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && CAMPAIGN_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('campaign.priority', 'DESC')
      queryBuilder.addOrderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }

  async sendCheckInEvent(userId: string) {
    try {
      const currentUnix = moment().unix()

      const campaign = await this.campaignService.findOne({
        type: CAMPAIGN_TYPE.ORDER,
        isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
        status: CAMPAIGN_STATUS.RUNNING,
        startDate: LessThanOrEqual(currentUnix),
      })

      if (!campaign) {
        return null
      }

      const missions = await this.missionService.getListCheckinMission(
        userId,
        campaign.id,
      )

      const existedClaimMission = missions.find((mission) => !mission.completed)
      if (!existedClaimMission) {
        return null
      }

      const lastReward =
        await this.rewardHistoryService.getLastRewardByCampaignId(
          campaign.id,
          userId,
        )

      const claimable = this.commonService.checkValidCheckinTime(
        campaign,
        moment().unix(),
        lastReward,
      )

      if (!claimable) {
        return null
      }

      const topicName = this.configService.get('kafka.reward_user_check_in')

      await this.kafkaService.sendMessage(topicName, {
        user_id: userId,
        created_at: Math.floor(Date.now() / 1000),
      })

      return plainToInstance(CheckinMissionDto, existedClaimMission, {
        ignoreDecorators: true,
      })
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  async findOne(id: number) {
    return this.campaignService.findOne(
      {
        id,
        isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
        type: CAMPAIGN_TYPE.DEFAULT,
      },
      {
        select: [
          'id',
          'title',
          'titleJa',
          'description',
          'descriptionJa',
          'startDate',
          'endDate',
          'notificationLink',
          'notificationLinkJa',
          'campaignImage',
          'campaignImageJa',
          'priority',
          'status',
        ],
      },
    )
  }

  async getCheckInCampaign(userId: string) {
    try {
      const currentUnix = moment().unix()

      const campaign = await this.campaignService.findOne({
        type: CAMPAIGN_TYPE.ORDER,
        isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
        status: CAMPAIGN_STATUS.RUNNING,
        startDate: LessThanOrEqual(currentUnix),
      })

      if (!campaign) {
        return {
          campaign: null,
          missions: [],
        }
      }

      const checkinCampaign = plainToInstance(CheckinCampaignDto, campaign, {
        ignoreDecorators: true,
      })

      const getMissions = this.missionService.getListCheckinMission(
        userId,
        checkinCampaign.id,
      )

      const getCheckinLog = this.userCheckinLogService.findOneByUserCampaign({
        userId: +userId,
        campaignId: checkinCampaign.id,
      })

      const getLastReward = this.rewardHistoryService.getLastRewardByCampaignId(
        checkinCampaign.id,
        userId,
      )

      const [missions, checkinLog, lastReward] = await Promise.all([
        getMissions,
        getCheckinLog,
        getLastReward,
      ])

      if (checkinLog) {
        if (
          checkinLog.lastIgnoreDisplay >=
          checkinCampaign.resetDisplayPreviousTime
        ) {
          checkinCampaign.shouldShowPopup = false
        }
      }

      const claimable = this.commonService.checkValidCheckinTime(
        campaign,
        moment().unix(),
        lastReward,
      )
      let updatedClaimStatus = false

      for (let index = 0; index < missions.length; index++) {
        if (missions[index].completed) {
          missions[index].status = CHECKIN_MISSION_STATUS.COMPLETED
          continue
        }

        if (!updatedClaimStatus) {
          missions[index].status = claimable
            ? CHECKIN_MISSION_STATUS.CLAIMABLE
            : CHECKIN_MISSION_STATUS.DISABLED
          updatedClaimStatus = true
          continue
        }

        missions[index].status = CHECKIN_MISSION_STATUS.DISABLED
      }

      return {
        campaign: checkinCampaign,
        missions: plainToInstance(CheckinMissionDto, missions, {
          ignoreDecorators: true,
        }),
      }
    } catch (error) {
      this.logger.error(error)
      return {
        campaign: null,
        missions: [],
      }
    }
  }

  async ignoreCheckinCampaignDisplay(userId: string) {
    try {
      const currentUnix = moment().unix()
      const campaign = await this.campaignService.findOne({
        type: CAMPAIGN_TYPE.ORDER,
        isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
        status: CAMPAIGN_STATUS.RUNNING,
        startDate: LessThanOrEqual(currentUnix),
      })

      if (!campaign) {
        return false
      }

      await this.userCheckinLogService.upsert({
        userId: +userId,
        campaignId: campaign.id,
        lastIgnoreDisplay: currentUnix,
      })

      return true
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }
}
