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
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { ApiCampaignService } from './api-campaign.service'

@Controller('campaign')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new campaign',
  })
  create(@Body() createCampaignDto: ApiCreateCampaignDto) {
    return this.apiCampaignService.create(createCampaignDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Campaign>> {
    return this.apiCampaignService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiCampaignService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: ApiUpdateCampaignDto,
  ) {
    return this.apiCampaignService.update(+id, updateCampaignDto)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.apiCampaignService.remove(+id)
  // }
}
