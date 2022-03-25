import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EVENTS } from '@lib/mission'
import { MissionsService } from './missions.service'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly missionsService: MissionsService,
  ) {}

  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_LOGIN'
    const value = message.value
    if (value.data.user_id === undefined) {
      this.logger.error(
        `[EVENT ${
          EVENTS[eventName]
        }] Wrong auth_user_login message struct: ${JSON.stringify(value)}`,
      )
      return
    }

    this.logger.debug(`eventName: ${eventName}, value: ${EVENTS[eventName]}`)
    const events = await this.missionsService.getEventsByName(EVENTS[eventName])
    this.logger.debug(`events: ${JSON.stringify(events)}`)
    if (events.length === 0) {
      this.logger.error(
        `[EVENT ${EVENTS[eventName]}] no mission/campaign in event auth_user_login`,
      )
      return
    }
    events.map((event) => {
      this.eventEmitter.emit('give_reward_to_user', {
        messageValue: message.value.data,
        missionId: event.missionId,
        campaignId: event.campaignId,
        eventName,
      })
    })
  }
}
