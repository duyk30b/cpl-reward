import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka, EventPattern } from '@nestjs/microservices'

@Controller()
export class Campaign02Controller implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect()
    // Send test message

    setInterval(() => {
      console.log('Ok start')
      this.kafkaClient.emit('user_created', 'Hellllo ' + Date())
    }, 2000)
  }
}
