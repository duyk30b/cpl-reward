import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IEvent } from '../interfaces/missions.interface'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  @OnEvent('write_log')
  async traceLog(logLevel, traceCode, data: IEvent) {
    let message =
      `[${data.msgId}] | [Name: ${data.msgName}] | ` +
      `[Message: ${
        TRACE_CODES[traceCode] === undefined
          ? traceCode
          : TRACE_CODES[traceCode]
      }]. `
    if (Object.keys(data.msgData).length > 0) {
      message = message + `Data: ${JSON.stringify(data.msgData)}`
    }

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
