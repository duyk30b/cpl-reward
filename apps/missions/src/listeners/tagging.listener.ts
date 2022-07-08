import { EventEmitterType } from '@lib/common'
import { ExternalUserTagService } from '@lib/external-user/external-user-tag/external-user-tag.service'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { UserTagInput } from '../interfaces/tagging.interface'

@Injectable()
export class TaggingListener {
  constructor(private externalUserTagService: ExternalUserTagService) {}

  @OnEvent(EventEmitterType.TAGGING_FOR_REWARD)
  async handleTaggingForUser(data: UserTagInput) {
    const res = await this.externalUserTagService.addUserTags({
      userTags: [data],
    })

    return res
  }
}
