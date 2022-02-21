import { registerAs } from '@nestjs/config'
import { Environment } from '@lib/common'

export default registerAs('common', () => ({
  env: process.env.ENV || Environment.Local,
  name: process.env.APP_NAME,
  reward_port: +process.env.REWARD_PORT || 3000,
  campaigns_port: +process.env.CAMPAIGNS_PORT || 3001,
  sentry_dsn:
    process.env.SENTRY_DSN ||
    'http://81a2bb7e8a5444fabdccd18fdc57230e@cpl-sentry.staging-bitcastle.work/33',
}))
