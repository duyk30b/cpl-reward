import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AdminCampaignService } from './admin-campaign.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'

@Controller('campaign')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @Get('init')
  async init() {
    return await this.adminCampaignService.init()
  }

  @Delete('cancel/:id')
  async cancel(@Param('id') id: string) {
    await this.adminCampaignService.cancel(+id)
  }

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Campaign>> {
    return this.adminCampaignService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.adminCampaignService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignGroupDto: ApiUpdateCampaignDto,
  ) {
    return this.adminCampaignService.update(+id, updateCampaignGroupDto)
  }
}
