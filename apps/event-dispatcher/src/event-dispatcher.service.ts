import { Injectable } from '@nestjs/common'

@Injectable()
export class EventDispatcherService {
  getHello(): string {
    return 'Hello World!'
  }
}
