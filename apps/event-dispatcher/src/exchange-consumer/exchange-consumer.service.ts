import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ExchangeConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleExchangeMessageResult(message: any, status: string) {
    return { message, status }
  }
}
