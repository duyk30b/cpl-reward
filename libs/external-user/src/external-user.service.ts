import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import UserService from './user.service.interface'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class ExternalUserService implements OnModuleInit {
  private readonly logger = new Logger(ExternalUserService.name)
  private userService: UserService

  constructor(@Inject('USER_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.clientGrpc.getService<UserService>('UserService')
  }

  async getUserInfo(userId: string) {
    try {
      return await lastValueFrom(this.userService.findOne({ id: userId }))
    } catch (e) {
      this.logger.log(`[External User] Error: ${e.message}`)
      return null
    }
  }
}
