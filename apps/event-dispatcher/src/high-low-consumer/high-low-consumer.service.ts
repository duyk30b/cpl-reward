import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HighLowConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleHighLowResult(message: any, status: string) {
    return { message, status }
  }
}
