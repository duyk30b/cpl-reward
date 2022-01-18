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
import { ApiCampaignGroupService } from './api-campaign-group.service'
import { ApiOperation } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { CampaignGroup } from '@app/campaign-group/entities/campaign-group.entity'
import { ApiCreateCampaignGroupDto } from './dto/api-create-campaign-group.dto'
import { ApiUpdateCampaignGroupDto } from './dto/api-update-campaign-group.dto'
import { ApiMapCampaignGroupDto } from './dto/api-map-campaign-group.dto'

@Controller('campaign-group')
export class ApiCampaignGroupController {
  constructor(
    private readonly apiCampaignGroupService: ApiCampaignGroupService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new campaign-group',
  })
  create(@Body() createCampaignGroupDto: ApiCreateCampaignGroupDto) {
    return this.apiCampaignGroupService.create(createCampaignGroupDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get campaign-group list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<CampaignGroup>> {
    return this.apiCampaignGroupService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign-group by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiCampaignGroupService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign-group',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignGroupDto: ApiUpdateCampaignGroupDto,
  ) {
    return this.apiCampaignGroupService.update(+id, updateCampaignGroupDto)
  }

  @Post('map-campaigns')
  @ApiOperation({
    summary: 'Map campaigns to campaign-group',
  })
  mapCampaigns(@Body() mapCampaignGroupDto: ApiMapCampaignGroupDto) {
    return this.apiCampaignGroupService.mapCampaigns(mapCampaignGroupDto)
  }

  @Post('unmap-campaigns')
  @ApiOperation({
    summary: 'Remove campaigns from campaign-group',
  })
  unmapCampaigns(@Body() mapCampaignGroupDto: ApiMapCampaignGroupDto) {
    return this.apiCampaignGroupService.unmapCampaigns(mapCampaignGroupDto)
  }
}
