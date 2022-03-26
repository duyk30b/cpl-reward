import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import UserService from './user.service.interface'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class ExternalUserService implements OnModuleInit {
  private userService: UserService

  constructor(@Inject('USER_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.clientGrpc.getService<UserService>('UserService')
  }

  async getUserInfo(userId: string) {
    const user = await lastValueFrom(this.userService.findOne({ id: userId }))
    if (Object.keys(user).length === 0) return null
    return user
  }
}
