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
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Mission } from '@app/mission/entities/mission.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { ApiMissionService } from './api-mission.service'

@Controller('campaign')
export class ApiMissionController {
  constructor(private readonly apiCampaignService: ApiMissionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new campaign',
  })
  create(@Body() createCampaignDto: ApiCreateMissionDto) {
    return this.apiCampaignService.create(createCampaignDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Mission>> {
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
    @Body() updateCampaignDto: ApiUpdateMissionDto,
  ) {
    return this.apiCampaignService.update(+id, updateCampaignDto)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.apiCampaignService.remove(+id)
  // }
}
