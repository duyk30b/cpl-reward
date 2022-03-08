import { Controller, Get, Param, Query, Req } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { STATUS } from '@lib/user-reward-history'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'
import { PaginatedMissionDto } from './dto/paginated-mission.dto'

@ApiTags('missions')
@Controller('missions')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(PaginatedMissionDto)
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  @ApiPaginatedResponse(PaginatedMissionDto)
  async findAll(
    @Query() apiMissionFilterDto: ApiMissionFilterDto,
    @Req() request: IRequestWithUserId,
  ) {
    const temp = await this.apiMissionService.findAll(
      apiMissionFilterDto,
      request.userId,
    )
    // TODO: fake response data for frontend team integrate
    const statusList = [
      STATUS.NOT_RECEIVE,
      STATUS.AUTO_RECEIVED,
      STATUS.MANUAL_NOT_RECEIVE,
      STATUS.MANUAL_RECEIVED,
    ]
    const items = temp.items.map((mission) => {
      return {
        id: mission.id,
        title: mission.title,
        amount: Math.floor(Math.random() * 100),
        currency: 'USDT',
        status: statusList[Math.floor(Math.random() * statusList.length)],
      }
    })
    return {
      meta: temp.meta,
      items,
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiMissionService.findOne(+id)
  }
}
