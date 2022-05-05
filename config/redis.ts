export default () => ({
  redis_config: {
    host: process.env.REWARD_REDIS_HOST || 'localhost',
    password: process.env.REWARD_REDIS_PASSWORD || '',
    port: process.env.REWARD_REDIS_PORT || 6379,
    db: process.env.REWARD_REDIS_DB || 0,
    worker_limit_duration:
      process.env.REWARD_REDIS_WORKER_LIMIT_DURATION || 300,
  },
})
