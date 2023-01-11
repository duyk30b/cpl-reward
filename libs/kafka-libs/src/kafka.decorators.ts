import { KAFKA_TOPIC_METADATA } from '@lib/kafka'

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
