import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { IWriteLog } from '../interfaces/missions.interface'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { EventAuthDocument } from '../schemas/event-auth.schema'
import { TypeEvent } from '@lib/common'
import { EventHighLowDocument } from '../schemas/event-high-low.schema'
import { EventBceDocument } from '../schemas/event-bce.schema'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TraceSaveListener {
  constructor(
    @InjectModel('EventAuth')
    private readonly eventAuthModel: Model<EventAuthDocument>,
    @InjectModel('EventHighLow')
    private readonly eventHighLowModel: Model<EventHighLowDocument>,
    @InjectModel('EventAuth')
    private readonly eventBceModel: Model<EventBceDocument>,
    private configService: ConfigService,
  ) {}

  @OnEvent('write_save_log')
  async traceLog(input: IWriteLog) {
    const { data } = input
    await this.saveLog(data)
  }

  async saveLog(data: any) {
    if (data.msgName) {
      let Model
      if (data.msgName.startsWith(TypeEvent.AUTH)) {
        Model = this.eventAuthModel
      } else if (data.msgName.startsWith(TypeEvent.HIGH_LOW)) {
        Model = this.eventHighLowModel
      } else if (data.msgName.startsWith(TypeEvent.BCE)) {
        Model = this.eventBceModel
      } else {
        return null
      }
      const newAuthEvent = new Model({
        type: 'REWARD_' + data.msgName,
        user_id: data.msgData.user_id,
        message_id: data.msgId,
        mission_id: data.missionId,
        data: data,
        status: true,
      })
      await newAuthEvent.save()
    }
  }
}
