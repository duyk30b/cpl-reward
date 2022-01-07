import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { currentUnixTime } from '@app/common/utils'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): number {
    return currentUnixTime('millisecond')
  }
}
