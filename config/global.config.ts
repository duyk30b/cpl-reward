import { registerAs } from '@nestjs/config'

export const GlobalConfig = registerAs('global', () => ({
  env: process.env.ENV || 'dev',
  app_name: process.env.APP_NAME || 'REWARD',
  enable_save_log: process.env.ENABLE_SAVE_LOG == 'true',
  sentry_dsn:
    process.env.SENTRY_DSN ||
    'http://81a2bb7e8a5444fabdccd18fdc57230e@cpl-sentry.staging-bitcastle.work/33',
}))
