import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IWriteLog } from '../interfaces/missions.interface'
import { ConfigService } from '@nestjs/config'
import { CommonService, EventEmitterType } from '@lib/common'
import { QueueService } from '@lib/queue'
import * as _ from 'lodash'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
    private readonly commonService: CommonService,
  ) {}

  @OnEvent(EventEmitterType.WRITE_LOG)
  async traceLog(logData: IWriteLog) {
    const input = _.cloneDeep(logData)
    const { logLevel, traceCode, params } = input
    let { data, extraData } = input
    data = this.hideInformation(data)
    extraData = this.hideInformation(extraData)

    const msgId = data === undefined ? 'N/A' : data.msgId
    const missionId = data === undefined ? '' : data.missionId
    const campaignId = data === undefined ? '' : data.campaignId
    const userId = data === undefined ? '' : data.msgData.user_id
    const msgDataJsonStr =
      data === undefined ? '{}' : JSON.stringify(data.msgData)
    const msgExtraDataJsonStr =
      extraData === undefined ? '{}' : JSON.stringify(extraData)

    const message =
      `[${msgId}] | ` +
      `[CAMPAIGN_${campaignId}] [MISSION_${missionId}] [USER_${userId}] | ` +
      `[Message: ${
        TRACE_CODES[traceCode] === undefined
          ? this.commonService.getLogMessageFromTemplate(traceCode, params)
          : this.commonService.getLogMessageFromTemplate(
              TRACE_CODES[traceCode],
              params === undefined ? {} : params,
            )
      }] | ` +
      `[Data: ${msgDataJsonStr}] | ` +
      `[Extra: ${msgExtraDataJsonStr}]`

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

    if (this.configService.get('enable_save_log')) {
      if (data && data.msgName) {
        const dataLog = {
          msgName: data.msgName,
          type: 'REWARD_' + data.msgName,
          user_id: data.msgData.user_id,
          message_id: data.msgId,
          mission_id: data.missionId,
          data: data,
          level_log: logLevel,
        }
        await this.queueService.addLog('reward_missions', dataLog, {
          removeOnComplete: 10000,
        })
      }
    }
  }

  hideInformation(data: any) {
    if (data && data.msgData) {
      // Email
      if (data.msgData.email) {
        data.msgData.email = CommonService.hideEmail(data.msgData.email)
      }
      if (data.email) {
        data.email = CommonService.hideEmail(data.email)
      }

      // IP
      if (data.msgData.ip) {
        data.msgData.ip = '***'
      }
      if (data.ip) {
        data.ip = '***'
      }
    }
    return data
  }
}
