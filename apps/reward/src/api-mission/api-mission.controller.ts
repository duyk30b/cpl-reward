import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'
import { PaginatedMissionDto } from './dto/paginated-mission.dto'

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

  @Get('money/earned')
  @ApiOperation({
    summary: 'Get money earned',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        amount: {
          type: 'string',
          example: '12.33333344',
        },
        currency: {
          type: 'string',
          example: 'USDT',
        },
      },
    },
  })
  async getEarned(@Req() request: IRequestWithUserId) {
    return this.apiMissionService.getAmountEarned(request.userId)
  }

  /**
   * TODO: below api using only for test
   */
  // @Get('phake')
  // async fakeData() {
  //   this.eventEmitter.emit('phake_data', {})
  //   return 'DONE'
  // }

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Get mission by ID',
  // })
  // findOne(@Param('id') id: string) {
  //   return this.apiMissionService.findOne(+id)
  // }
}
