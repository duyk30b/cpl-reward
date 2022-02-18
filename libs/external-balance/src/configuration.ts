import { registerAs } from '@nestjs/config'

export default registerAs('balance', () => ({
  url:
    process.env.BALANCE_URL ||
    'https://api.dev.staging-bitcastle.work/backend/api/v3/',
  token: process.env.BALANCE_TOKEN || '',
}))
