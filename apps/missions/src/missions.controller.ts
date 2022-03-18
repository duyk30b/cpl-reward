import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS } from '@lib/mission'
import { DemoService } from './demo/demo.service'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private readonly demoService: DemoService,
  ) {}

  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    if (message.value.user_id === undefined) {
      this.logger.error(
        'Wrong auth_user_login message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }
    const user = await this.externalUserService.getUserInfo(
      message.value.user_id,
    )
    if (user === null) {
      this.logger.error('Wrong user info: ' + JSON.stringify(user))
      return
    }

    const events = await this.demoService.getEventsByName(
      EVENTS.AUTH_USER_LOGIN,
    )
    if (events.length === 0) {
      this.logger.error('no mission/campaign in event auth_user_login: ')
      return
    }
    events.map((event) => {
      this.eventEmitter.emit('auth_user_login', {
        user,
        missionId: event.missionId,
        campaignId: event.campaignId,
        messageValue: message.value,
      })
    })
  }
}
