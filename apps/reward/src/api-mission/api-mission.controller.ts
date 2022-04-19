import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'
import { PaginatedMissionDto } from './dto/paginated-mission.dto'
import { PaginateUserRewardHistory } from '@lib/user-reward-history/dto/paginate-user-reward-history.dto'
import { ApiPaginateUserRewardHistory } from './dto/api-paginate-user-reward-history.dto'
import { instanceToPlain, plainToInstance } from 'class-transformer'

// import { EventEmitter2 } from '@nestjs/event-emitter'

@ApiTags('missions')
@Controller('missions')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(PaginatedMissionDto)
export class ApiMissionController {
  constructor(
    private readonly apiMissionService: ApiMissionService, // private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  @ApiPaginatedResponse(PaginatedMissionDto)
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
  async getAffiliateEarned(@Req() request: IRequestWithUserId) {
    return this.apiMissionService.getAffiliateEarned(request.userId)
  }

  @Get('affiliate-earned-detail')
  @ApiOperation({
    summary: 'Get money earned by affiliate program (return detail list)',
  })
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
}
