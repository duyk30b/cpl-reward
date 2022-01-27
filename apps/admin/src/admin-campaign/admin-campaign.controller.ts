import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { AdminCampaignService } from './admin-campaign.service'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'

@Controller('campaign')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @Get('init')
  async init(): Promise<{ id: number }> {
    return await this.adminCampaignService.init()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Create new campaign',
  })
  create(@Body() createCampaignGroupDto: ApiCreateCampaignDto) {
    return this.adminCampaignService.create(createCampaignGroupDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.adminCampaignService.findOne(+id)
  }

  @UseInterceptors(ClassSerializerInterceptor)
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
