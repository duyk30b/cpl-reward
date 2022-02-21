import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_URI,
  consumer: process.env.KAFKA_CONSUMER,
  auth_user_login: process.env.ENV + '_auth_user_login',
}))
