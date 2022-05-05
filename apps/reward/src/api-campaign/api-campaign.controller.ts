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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
// import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { PaginatedCampaignDto } from './dto/paginated-campaign.dto'
import { PaginatedMetaDto } from '../dto/paginated.dto'
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator'
import {
  GetCampaignByIdResponse,
  NotFoundResponse,
  UnauthorizedResponse,
} from '../constants'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'

@ApiTags('campaigns')
@Controller('campaigns')
@ApiExtraModels(PaginatedMetaDto)
@ApiExtraModels(PaginatedCampaignDto)
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'Get campaign list',
  })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
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
  @ApiNotFoundResponse(NotFoundResponse)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiOkResponse(GetCampaignByIdResponse)
  async findOne(@Param('id') id: string) {
    const result = await this.apiCampaignService.findOne(+id)
    if (result === undefined) {
      throw new HttpException('Campaign was not found!', HttpStatus.NOT_FOUND)
    }
    return result
  }
}
