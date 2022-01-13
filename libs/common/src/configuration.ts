import { registerAs } from '@nestjs/config'
import { Environment } from '@app/common'

export default registerAs('common', () => ({
  env: process.env.ENV || Environment.Local,
  name: process.env.APP_NAME,
  reward_port: +process.env.REWARD_PORT || 3000,
  campaigns_port: +process.env.CAMPAIGNS_PORT || 3001,
}))
