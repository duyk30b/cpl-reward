import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { ClientGrpc, Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import UserService from './demo/user.service.interface'
import { lastValueFrom } from 'rxjs'

@Controller()
export class MissionsController implements OnModuleInit {
  private readonly logger = new Logger(MissionsController.name)
  private userService: UserService

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject('USER_PACKAGE') private clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.clientGrpc.getService<UserService>('UserService')
  }

  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    if (message.value.user_id === undefined) {
      this.logger.error(
        'Wrong auth_user_login message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }
    this.logger.log(
      '[STEP 1] auth_user_login message struct' + JSON.stringify(message.value),
    )
    const user = await lastValueFrom(
      this.userService.findOne({ id: message.value.user_id }),
    )
    if (Object.keys(user).length === 0) {
      this.logger.error('Wrong user info: ' + JSON.stringify(user))
      return
    }
    this.eventEmitter.emit('auth_user_login', { id: message.value.user_id })
  }
}
