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

@Controller('missions')
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new mission',
  })
  create(@Body() createCampaignDto: ApiCreateMissionDto) {
    return this.apiMissionService.create(createCampaignDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Mission>> {
    return this.apiMissionService.findAll(page, limit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.apiMissionService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update mission',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: ApiUpdateMissionDto,
  ) {
    return this.apiMissionService.update(+id, updateCampaignDto)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.apiMissionService.remove(+id)
  // }
}
