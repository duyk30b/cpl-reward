import { Controller, Get } from '@nestjs/common'
import { Campaign01Service } from './campaign01.service'

@Controller()
export class Campaign01Controller {
  constructor(private readonly campaign01Service: Campaign01Service) {}

  @Get()
  getHello(): string {
    return this.campaign01Service.getHello()
  }
}
