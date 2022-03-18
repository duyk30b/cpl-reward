import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import {
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { PaginatedCampaignDto } from './dto/paginated-campaign.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'

@ApiTags('campaigns')
@Controller('campaigns')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(PaginatedCampaignDto)
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiPaginatedResponse(PaginatedCampaignDto)
  async findAll(
    @Query() apiCampaignFilterDto: ApiCampaignFilterDto,
    @Req() request: IRequestWithUserId,
  ) {
    return this.apiCampaignService.findAll(apiCampaignFilterDto, request.userId)
  }

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Get campaign by ID',
  // })
  // findOne(@Param('id') id: string) {
  //   return this.apiCampaignService.findOne(+id)
  // }
}
