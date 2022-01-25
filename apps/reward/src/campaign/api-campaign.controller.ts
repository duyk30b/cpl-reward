import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiOperation } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
// TODO: remove below import
// import { ApiMapCampaignGroupDto } from './dto/api-map-campaign.dto'

@Controller('campaign')
export class ApiCampaignController {
  constructor(private readonly apiCampaignGroupService: ApiCampaignService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new campaign',
  })
  create(@Body() createCampaignGroupDto: ApiCreateCampaignDto) {
    return this.apiCampaignGroupService.create(createCampaignGroupDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Campaign>> {
    return this.apiCampaignGroupService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiCampaignGroupService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignGroupDto: ApiUpdateCampaignDto,
  ) {
    return this.apiCampaignGroupService.update(+id, updateCampaignGroupDto)
  }

  // TODO: remove below import
  // @Post('map-campaigns')
  // @ApiOperation({
  //   summary: 'Map campaigns to campaign',
  // })
  // mapCampaigns(@Body() mapCampaignGroupDto: ApiMapCampaignGroupDto) {
  //   return this.apiCampaignGroupService.mapCampaigns(mapCampaignGroupDto)
  // }
  // @Post('unmap-campaigns')
  // @ApiOperation({
  //   summary: 'Remove campaigns from campaign',
  // })
  // unmapCampaigns(@Body() mapCampaignGroupDto: ApiMapCampaignGroupDto) {
  //   return this.apiCampaignGroupService.unmapCampaigns(mapCampaignGroupDto)
  // }
}
