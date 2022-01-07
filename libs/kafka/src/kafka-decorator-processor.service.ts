import { MessagePattern } from '@nestjs/microservices'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KAFKA_TOPIC_METADATA } from '@app/kafka'

@Injectable()
export class KafkaDecoratorProcessorService {
  constructor(private configService: ConfigService) {}

  processKafkaDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype)
      for (const prop of propNames) {
        const propValue = Reflect.getMetadata(
          KAFKA_TOPIC_METADATA,
          Reflect.get(type.prototype, prop),
        )

        if (propValue) {
          const topic = this.configService.get(propValue)
          Reflect.decorate(
            [MessagePattern(topic)],
            type.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.prototype, prop),
          )
        }
      }
    }
  }
}
