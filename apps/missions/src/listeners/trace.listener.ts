import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IWriteLog } from '../interfaces/missions.interface'
import { MissionsService } from '../missions.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { EventAuthDocument } from '../schemas/event-auth.schema'
import { TypeEvent } from '@lib/common'
import { EventHighLowDocument } from '../schemas/event-high-low.schema'
import { EventBceDocument } from '../schemas/event-bce.schema'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  constructor(
    @InjectModel('EventAuth')
    private readonly eventAuthModel: Model<EventAuthDocument>,
    @InjectModel('EventHighLow')
    private readonly eventHighLowModel: Model<EventHighLowDocument>,
    @InjectModel('EventAuth')
    private readonly eventBceModel: Model<EventBceDocument>,
    private configService: ConfigService,
    private readonly missionsService: MissionsService,
  ) {}

  @OnEvent('write_log')
  async traceLog(input: IWriteLog) {
    const { logLevel, traceCode, data, extraData, params } = input
    const msgId = data === undefined ? 'N/A' : data.msgId
    const msgName = data === undefined ? 'N/A' : data.msgName
    const msgDataJsonStr =
      data === undefined ? '{}' : JSON.stringify(data.msgData)
    const msgExtraDataJsonStr =
      extraData === undefined ? '{}' : JSON.stringify(extraData)

    const message =
      `[${msgId}] | [Name: ${msgName}] |` +
      ` [Message: ${
        TRACE_CODES[traceCode] === undefined
          ? this.missionsService.getLogMessageFromTemplate(traceCode, params)
          : this.missionsService.getLogMessageFromTemplate(
              TRACE_CODES[traceCode],
              params === undefined ? {} : params,
            )
      }]. Data: ${msgDataJsonStr}. Extra Data: ${msgExtraDataJsonStr}`

    switch (logLevel) {
      case 'debug':
        this.logger.debug(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      case 'error':
        this.logger.error(message)
        break
      default:
        this.logger.log(message)
        break
    }

    if (this.configService.get('debug.enable_save_log')) {
      await this.saveLog(data)
    }
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
