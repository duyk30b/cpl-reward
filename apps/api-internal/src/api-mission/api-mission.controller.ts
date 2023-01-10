import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import {
  PaginatedMetaAffiliateDto,
  PaginatedMetaDto,
  PaginatedMetaLoadMoreDto,
} from '../dto/paginated.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { PaginatedMissionDto } from './dto/paginated-mission.dto'
import { PaginateUserRewardHistory } from '@lib/user-reward-history/dto/paginate-user-reward-history.dto'
import { ApiPaginateUserRewardHistory } from './dto/api-paginate-user-reward-history.dto'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import {
  AffiliateEarnedShortResponse,
  RedeemMissionResponse,
  UnauthorizedResponse,
} from '../constants'
import { ApiLoadMoreResponseDecorator } from '../decorators/api-load-more-response.decorator'
import { PaginatedAffiliateEarnedDetailDto } from './dto/paginated-affiliate-earned-detail.dto'
import { ApiAffiliateResponseDecorator } from '../decorators/api-affiliate-response.decorator'

@ApiTags('missions')
@Controller('missions')
@ApiExtraModels(PaginatedMetaDto)
@ApiExtraModels(PaginatedMetaLoadMoreDto)
@ApiExtraModels(PaginatedMetaAffiliateDto)
@ApiExtraModels(PaginatedMissionDto)
@ApiExtraModels(PaginatedAffiliateEarnedDetailDto)
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiLoadMoreResponseDecorator(PaginatedMissionDto)
  async findAll(
    @Query() apiMissionFilterDto: ApiMissionFilterDto,
    @Req() request: IRequestWithUserId,
  ) {
    return this.apiMissionService.findPublicMissions(
      apiMissionFilterDto,
      request.userId,
    )
  }

  @Get('affiliate-earned-short')
  @ApiOperation({
    summary: 'Get money earned by affiliate program (return total money)',
  })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiOkResponse(AffiliateEarnedShortResponse)
  async getAffiliateEarned(@Req() request: IRequestWithUserId) {
    return this.apiMissionService.getAffiliateEarned(request.userId)
  }

  @Get('affiliate-earned-detail')
  @ApiOperation({
    summary: 'Get money earned by affiliate program (return detail list)',
  })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiAffiliateResponseDecorator(PaginatedAffiliateEarnedDetailDto)
  async getAffiliateDetailHistory(
    @Query() filterPaginateUserHistory: ApiPaginateUserRewardHistory,
    @Req() request: IRequestWithUserId,
  ) {
    const filter = plainToInstance(
      PaginateUserRewardHistory,
      instanceToPlain(filterPaginateUserHistory, { ignoreDecorators: true }),
    )
    filter.userId = request.userId

    return this.apiMissionService.getAffiliateDetailHistory(filter)
  }

  @Post(':id/redeem')
  @ApiOperation({
    summary: 'Request to redeem mission',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiOkResponse(RedeemMissionResponse)
  async redeem(@Param('id') id: number, @Req() request: IRequestWithUserId) {
    const result = await this.apiMissionService.requestRedeemMission(
      id,
      request.userId,
    )

    return {
      success: result,
    }
  }
}
