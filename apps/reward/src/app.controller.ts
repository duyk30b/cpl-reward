import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('test')
  // async test() {
  //   const result = await this.appService.testFn()
  //   console.log(result)
  // }
}
