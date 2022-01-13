import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_BROKERS,
  campaigns_group_id: process.env.ENV + '_' + process.env.CAMPAIGNS_GROUP_ID,
  hl_user_spend_money: process.env.ENV + '_' + process.env.HL_USER_SPEND_MONEY,
}))
