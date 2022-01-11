import { registerAs } from '@nestjs/config'

export default registerAs('mysql', () => ({
  master: {
    host: process.env.REWARD_MYSQL_MASTER_HOST || 'localhost',
    port: process.env.REWARD_MYSQL_MASTER_HOST || 3361,
    user: process.env.REWARD_MYSQL_MASTER_HOST || 'root',
    pass: process.env.REWARD_MYSQL_MASTER_HOST || 'password',
    db: process.env.REWARD_MYSQL_MASTER_HOST || 'reward',
  },
}))
