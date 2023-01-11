import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BceConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleBceMessageResult(message: any, status: string) {
    return { message, status }
  }
}
