import { Controller, Get, Param, Query, Req } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
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
    return this.apiMissionService.findAll(apiMissionFilterDto, request.userId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiMissionService.findOne(+id)
  }
}
