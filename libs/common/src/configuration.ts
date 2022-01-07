import { registerAs } from '@nestjs/config'
import { Environment } from '@app/common'

export default registerAs('common', () => ({
  env: process.env.APP_ENV || Environment.Local,
  name: process.env.APP_NAME,
  reward_port: +process.env.REWARD_PORT || 3000,
  c01_port: +process.env.C01_PORT || 3001,
}))
