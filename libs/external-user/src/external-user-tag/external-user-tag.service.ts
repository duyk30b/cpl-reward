import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { AddUserTagInput, UserTagService } from './user-tag.interface'

@Injectable()
export class ExternalUserTagService {
  private readonly logger = new Logger(ExternalUserTagService.name)
  private userTagService: UserTagService

  constructor(@Inject('USER_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userTagService =
      this.clientGrpc.getService<UserTagService>('GUserTagService')
  }

  async addUserTags(dataUserTag: AddUserTagInput) {
    return await lastValueFrom(this.userTagService.addUserTags(dataUserTag))
  }
}
