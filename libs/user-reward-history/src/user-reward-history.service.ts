import { Injectable } from '@nestjs/common'
import { CreateUserRewardHistoryDto } from '@lib/user-reward-history/dto/create-user-reward-history.dto'
import { plainToInstance } from 'class-transformer'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { USER_REWARD_STATUS } from './enum'
import { GRANT_TARGET_USER } from '@lib/mission'

@Injectable()
export class UserRewardHistoryService {
  constructor(
    @InjectRepository(UserRewardHistory)
    private userRewardHistoryRepository: Repository<UserRewardHistory>,
  ) {}

  async save(userRewardHistoryDto: CreateUserRewardHistoryDto) {
    const createUserRewardHistory = plainToInstance(
      CreateUserRewardHistoryDto,
      userRewardHistoryDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )

    const userRewardHistoryEntity = plainToInstance(
      UserRewardHistory,
      createUserRewardHistory,
      {
        ignoreDecorators: true,
      },
    )
    return await this.userRewardHistoryRepository.save(userRewardHistoryEntity)
  }

  async updateById(id: number, conditions: any) {
    return await this.userRewardHistoryRepository.update({ id }, conditions)
  }

  async getAmountByUser(
    missionIds: number[],
    userId: string,
    statusName: number,
  ) {
    const queryBuilder =
      this.userRewardHistoryRepository.createQueryBuilder('history')
    queryBuilder.where('history.missionId IN (:...mission_ids)', {
      mission_ids: missionIds,
    })
    queryBuilder.andWhere('history.userId = :user_id', {
      user_id: userId,
    })
    queryBuilder.andWhere('history.status = :status_name', {
      status_name: statusName,
    })
    queryBuilder.groupBy('history.currency')
    queryBuilder.addGroupBy('history.missionId')
    queryBuilder.select('history.currency')
    queryBuilder.addSelect('history.wallet')
    queryBuilder.addSelect('history.missionId')
    queryBuilder.addSelect('SUM (history.amount)', 'total_amount')
    const histories = await queryBuilder.getRawMany()
    if (histories.length === 0) return null

    const result = {}
    for (const idx in histories) {
      result[
        `${histories[idx].history_mission_id}_${histories[idx].history_currency}`
      ] = histories[idx].total_amount
    }
    return result
  }

  async getAmountEarned(userId: string) {
    const queryBuilder =
      this.userRewardHistoryRepository.createQueryBuilder('history')
    queryBuilder.where('history.userId = :user_id', {
      user_id: userId,
    })
    queryBuilder.andWhere('history.status = :status_type', {
      status_type: USER_REWARD_STATUS.RECEIVED,
    })
    queryBuilder.andWhere('history.userType = :user_type', {
      user_type: GRANT_TARGET_USER.REFERRAL_USER,
    })
    queryBuilder.groupBy('history.currency')
    queryBuilder.select('history.currency')
    queryBuilder.addSelect('history.wallet')
    queryBuilder.addSelect('SUM (history.amount)', 'total_amount')
    return queryBuilder.getRawMany()
  }
}
