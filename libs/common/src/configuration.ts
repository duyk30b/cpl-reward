import { registerAs } from '@nestjs/config'
import { Environment } from '@lib/common'
import { WALLET_VERSION } from '@libs/wallet-gateway/wallet.enum'

export default registerAs('common', () => ({
  env: process.env.ENV || Environment.Local,
  name: process.env.APP_NAME,
  reward_port: +process.env.REWARD_PORT || 3000,
  campaigns_port: +process.env.CAMPAIGNS_PORT || 3001,
  wallet_version: process.env.WALLET_VERSION || WALLET_VERSION.FIRST_VERSION,
  sentry_dsn:
    process.env.SENTRY_DSN ||
    'http://81a2bb7e8a5444fabdccd18fdc57230e@cpl-sentry.staging-bitcastle.work/33',
}))
