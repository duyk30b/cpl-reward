import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka, EventPattern } from '@nestjs/microservices'

@Controller()
export class Campaign01Controller implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    //await this.kafkaClient.connect()
  }

  @EventPattern('user_created')
  async handleUserCreated(data: any) {
    console.log(data)
  }
}
