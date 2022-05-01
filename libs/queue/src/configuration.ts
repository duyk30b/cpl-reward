import { registerAs } from '@nestjs/config'

export default registerAs('queue', () => ({
  host: process.env.REWARD_REDIS_HOST || 'localhost',
  port: process.env.REWARD_REDIS_PORT || 6379,
  db: process.env.REWARD_REDIS_DB || 0,
  pass: process.env.REWARD_REDIS_PASSWORD || '',
}))
