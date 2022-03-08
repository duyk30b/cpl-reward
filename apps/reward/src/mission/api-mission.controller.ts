import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Mission } from '@lib/mission/entities/mission.entity'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'

@Controller('missions')
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  @ApiQuery({ type: ApiMissionFilterDto })
  async findAll(
    @Query() apiMissionFilterDto: ApiMissionFilterDto,
  ): Promise<Pagination<Mission, CustomPaginationMetaTransformer>> {
    return this.apiMissionService.findAll(apiMissionFilterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiMissionService.findOne(+id)
  }
}
