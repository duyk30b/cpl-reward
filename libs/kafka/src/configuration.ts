import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_BROKERS,
  consumer_c01: process.env.CONSUMER_PREFIX + '01',
  consumer_c02: process.env.CONSUMER_PREFIX + '02',
  hl_user_spend_money: process.env.HL_USER_SPEND_MONEY,
}))
