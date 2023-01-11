import { EAuthEvent, KafkaTopic } from '@libs/kafka-libs'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { AuthConsumerService } from './auth-consumer.service'

@Controller()
export class AuthConsumerController {
  constructor(private readonly authConsumerService: AuthConsumerService) {}

  @KafkaTopic(EAuthEvent.USER_CREATE)
  async handleUserCreate(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserCreate ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_LOGIN)
  async handleUserLogin(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserLogin ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_LOGOUT)
  async handleUserLogout(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserLogout ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_CHANGE_EMAIL)
  async handleUserChangeEmail(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserChangeEmail ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_CHANGE_PASSWORD)
  async handleUserChangePassword(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserChangePassword ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_CHANGE_LV)
  async handleUserChangeLv(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserChangeLv ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_CHANGE_INFO)
  async handleUserChangeInfo(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserChangeInfo ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_AUTHENTICATOR_STATUS_UPDATED)
  async handleUserAuthenticatorStatusUpdate(@Payload('value') message: any) {
    console.log(
      '🚀 ~ file: ~ handleUserAuthenticatorStatusUpdate ~ message',
      message,
    )
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_KYC_STATUS_UPDATED)
  async handleUserKycStatusUpdated(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserKycStatusUpdated ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_KYC_REGISTERED)
  async handleUserKycRegister(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserKycRegister ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }

  @KafkaTopic(EAuthEvent.USER_KYC_AUTO_KYC_FINISHED)
  async handleUserKycAutoKycFinished(@Payload('value') message: any) {
    console.log('🚀 ~ file: ~ handleUserKycAutoKycFinished ~ message', message)
    await this.authConsumerService.handleAuthMessageResult(message, '')
  }
}
