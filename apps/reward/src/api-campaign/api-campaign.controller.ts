import {
  Controller,
  Get,
  Query,
  Param,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
// import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { PaginatedCampaignDto } from './dto/paginated-campaign.dto'
import { PaginatedDto } from '../dto/paginated.dto'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'
import { GetCampaignByIdResponse } from './constants'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'

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
    // request.userId
    return this.apiCampaignService.findPublicCampaigns(
      apiCampaignFilterDto,
      request.userId,
    )
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign by ID',
  })
  @ApiOkResponse(GetCampaignByIdResponse)
  async findOne(@Param('id') id: string) {
    const result = await this.apiCampaignService.findOne(+id)
    if (result === undefined) {
      throw new HttpException('Campaign was not found!', HttpStatus.NOT_FOUND)
    }
    return result
  }
}
