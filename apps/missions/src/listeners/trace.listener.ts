import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IWriteLog } from '../interfaces/missions.interface'
import { MissionsService } from '../missions.service'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  constructor(private readonly missionsService: MissionsService) {}

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
  }
}
