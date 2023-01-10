import { Module } from '@nestjs/common'
import { EventDispatcherController } from './event-dispatcher.controller'
import { EventDispatcherService } from './event-dispatcher.service'

@Module({
  imports: [],
  controllers: [EventDispatcherController],
  providers: [EventDispatcherService],
})
export class EventDispatcherModule {}
