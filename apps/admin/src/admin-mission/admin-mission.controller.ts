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
import { AdminMissionService } from './admin-mission.service'
import { ApiOperation } from '@nestjs/swagger'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Mission } from '@app/mission/entities/mission.entity'

@Controller('mission')
export class AdminMissionController {
  constructor(private readonly adminMissionService: AdminMissionService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Create new mission',
  })
  create(@Body() createMissionDto: ApiCreateMissionDto) {
    return this.adminMissionService.create(createMissionDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get mission list',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Mission>> {
    return this.adminMissionService.findAll(page, limit)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get mission by ID',
  })
  findOne(@Param('id') id: string) {
    return this.adminMissionService.findOne(+id)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update campaign',
  })
  update(
    @Param('id') id: string,
    @Body() updateMissionDto: ApiUpdateMissionDto,
  ) {
    return this.adminMissionService.update(+id, updateMissionDto)
  }
}
