import { Test, TestingModule } from '@nestjs/testing'
import { EventDispatcherController } from './event-dispatcher.controller'
import { EventDispatcherService } from './event-dispatcher.service'

describe('EventDispatcherController', () => {
  let eventDispatcherController: EventDispatcherController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventDispatcherController],
      providers: [EventDispatcherService],
    }).compile()

    eventDispatcherController = app.get<EventDispatcherController>(
      EventDispatcherController,
    )
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eventDispatcherController.getHello()).toBe('Hello World!')
    })
  })
})
