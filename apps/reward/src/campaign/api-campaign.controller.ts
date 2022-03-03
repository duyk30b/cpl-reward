import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'

@Controller('campaigns')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  @ApiQuery({ type: ApiCampaignFilterDto })
  async findAll(
    @Query() apiCampaignFilterDto: ApiCampaignFilterDto,
  ): Promise<Pagination<Campaign, CustomPaginationMetaTransformer>> {
    return this.apiCampaignService.findAll(apiCampaignFilterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiCampaignService.findOne(+id)
  }
}
