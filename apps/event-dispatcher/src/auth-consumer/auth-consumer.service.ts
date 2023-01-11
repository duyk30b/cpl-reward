import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthConsumerService {
  constructor(private readonly configService: ConfigService) {}

  async handleAuthMessageResult(message: any, status: string) {
    return { message, status }
  }
}
