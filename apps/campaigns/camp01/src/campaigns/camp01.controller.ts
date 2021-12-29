import { Controller, Get } from '@nestjs/common';
import { Campaigns/camp01Service } from './campaigns/camp01.service';

@Controller()
export class Campaigns/camp01Controller {
  constructor(private readonly campaigns/camp01Service: Campaigns/camp01Service) {}

  @Get()
  getHello(): string {
    return this.campaigns/camp01Service.getHello();
  }
}
