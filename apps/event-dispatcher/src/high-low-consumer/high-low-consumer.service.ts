import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HighLowResultMessageDto } from './high-low-consumer.dto'

@Injectable()
export class HighLowConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleHighLowResult(message: HighLowResultMessageDto, status: string) {
    return { message, status }
  }
}
