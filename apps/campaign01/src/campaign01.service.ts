import { Injectable } from '@nestjs/common'

@Injectable()
export class Campaign01Service {
  getHello(): string {
    return 'Hello World!'
  }
}
