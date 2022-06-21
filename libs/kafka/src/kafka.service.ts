import { CommonService } from '@lib/common'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name)

  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private commonService: CommonService,
  ) {}

  async onModuleInit() {
    try {
      await this.kafkaClient.connect()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async sendMessage(topicName: string, data: any, version = 1) {
    const message = {
      data: this.commonService.stripNull(data),
      create_time: new Date().getTime(),
      version: version,
    }

    return await lastValueFrom(this.kafkaClient.emit(topicName, message))
  }
}
