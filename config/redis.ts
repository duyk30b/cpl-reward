export default () => ({
  redis_config: {
    host: process.env.REWARD_REDIS_HOST || 'localhost',
    port: process.env.REWARD_REDIS_PORT || 6379,
    db: process.env.REWARD_REDIS_DB || 0,
  },
})
