import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RewardConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleRewardMessageResult(message: any, status: string) {
    return { message, status }
  }
}
