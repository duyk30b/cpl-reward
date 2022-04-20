import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IWriteLog } from '../interfaces/missions.interface'
import { MissionsService } from '../missions.service'
import { ConfigService } from '@nestjs/config'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  constructor(
    private readonly missionsService: MissionsService,
    private readonly configService: ConfigService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  @OnEvent('write_log')
  async traceLog(input: IWriteLog) {
    const { logLevel, traceCode, data, extraData, params } = input
    const msgId = data === undefined ? 'N/A' : data.msgId
    const missionId = data === undefined ? '' : data.missionId
    const campaignId = data === undefined ? '' : data.campaignId
    const msgDataJsonStr =
      data === undefined ? '{}' : JSON.stringify(data.msgData)
    const msgExtraDataJsonStr =
      extraData === undefined ? '{}' : JSON.stringify(extraData)

    const message =
      `[${msgId}] |` +
      `[M${missionId}] [C${campaignId}]` +
      ` [Message: ${
        TRACE_CODES[traceCode] === undefined
          ? this.missionsService.getLogMessageFromTemplate(traceCode, params)
          : this.missionsService.getLogMessageFromTemplate(
              TRACE_CODES[traceCode],
              params === undefined ? {} : params,
            )
      }] |` +
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
        await this.redisQueueService.addRewardMissionsJob(
          'reward_missions',
          dataLog,
        )
      }
    }
  }
}
