import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@app/kafka'
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
      this.logger.warn(
        'Wrong auth_user_login message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }
    // const user = await lastValueFrom(
    //   this.userService.findOne({ id: message.value.user_id }),
    // )
    // TODO: fake data user info
    const user = {
      id: '41458',
      uuid: '08f3894d-1b81-4b1b-a81e-4bb51b573dd9',
      email: 'phamsonhai+1@cryptopie-labo.com',
      type: '1',
      status: '1',
      referrer_code: '08f389',
      referred_by_id: '41448',
      last_login: '1635219914131',
      email_verify_at: '1632812996759',
      authenticator_verify_at: '1633599427244',
      created_at: '1632812861000',
      updated_at: '1635087168000',
      bce_updated_at: '1635087168000',
      email_verify_status: '2',
      authenticator_verify_status: '1',
      kyc_verify_status: '2',
      user_info_status: '2',
      account_lv: '1',
    }
    if (!user) {
      this.logger.warn('Wrong user info: ' + JSON.stringify(user))
      return
    }
    this.eventEmitter.emit('auth_user_login', { id: message.value.user_id })
  }
}
