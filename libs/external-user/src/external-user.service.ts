import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import UserService from './user.service.interface'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { User } from '@lib/external-user/user.interface'
import { validate } from 'class-validator'

@Injectable()
export class ExternalUserService implements OnModuleInit {
  private readonly logger = new Logger(ExternalUserService.name)
  private userService: UserService

  constructor(@Inject('USER_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.clientGrpc.getService<UserService>('UserService')
  }

  async getUserInfo(userId: string): Promise<User> {
    try {
      const user = plainToInstance(
        User,
        await lastValueFrom(this.userService.findOne({ id: userId })),
        { ignoreDecorators: true },
      )
      if (!(await validate(user)) || !user.id) {
        return null
      }
      return user
    } catch (e) {
      this.logger.log(`[External User] Error: ${e.message}`)
      return null
    }
  }
}
