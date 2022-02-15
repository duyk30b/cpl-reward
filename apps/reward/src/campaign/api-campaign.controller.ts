import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiOperation } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { CustomPaginationMetaTransformer } from '@app/common/transformers/custom-pagination-meta.transformer'

@Controller('campaigns')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Campaign, CustomPaginationMetaTransformer>> {
    return this.apiCampaignService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiCampaignService.findOne(+id)
  }
}
