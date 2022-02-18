import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiOperation } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Mission } from '@lib/mission/entities/mission.entity'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'

@Controller('missions')
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Mission, CustomPaginationMetaTransformer>> {
    return this.apiMissionService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiMissionService.findOne(+id)
  }
}
