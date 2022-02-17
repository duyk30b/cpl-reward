import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_URI,
  consumer: process.env.KAFKA_CONSUMER,
}))
