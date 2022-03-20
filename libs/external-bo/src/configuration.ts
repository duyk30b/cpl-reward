import { registerAs } from '@nestjs/config'

export default registerAs('bo', () => ({
  url:
    process.env.BO_URL || 'https://api.dev.staging-bitcastle.work/balance/v1',
  token: process.env.BO_TOKEN || '',
}))
