import { Controller, Get } from '@nestjs/common'
import { EventDispatcherService } from './event-dispatcher.service'

@Controller()
export class EventDispatcherController {
  constructor(
    private readonly eventDispatcherService: EventDispatcherService,
  ) {}

  @Get()
  getHello(): string {
    return this.eventDispatcherService.getHello()
  }
}
