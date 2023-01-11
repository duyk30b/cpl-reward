import { KAFKA_TOPIC_METADATA } from '@lib/kafka'
import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

// https://github.com/nestjs/nest/issues/3912
export function KafkaTopic(config: string) {
  return (
    tartget: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(KAFKA_TOPIC_METADATA, config, descriptor.value)
    return descriptor
  }
}

export const MessageId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return `topic_${request.topic}_parition_${request.partition}_offset_${request.offset}`
  },
)
