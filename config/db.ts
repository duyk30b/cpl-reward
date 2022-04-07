export default () => ({
  reward: {
    mysql: {
      master: {
        host: process.env.REWARD_MYSQL_MASTER_HOST || 'localhost',
        port: process.env.REWARD_MYSQL_MASTER_PORT || 3360,
        user: process.env.REWARD_MYSQL_MASTER_USER || 'root',
        pass: process.env.REWARD_MYSQL_MASTER_PASS || 'password',
        db: process.env.REWARD_MYSQL_MASTER_DB || 'reward',
      },
    },
  },
  missions: {
    mongo: {
      dsn: process.env.MONGO_DSN || 'mongodb://localhost:27017/kafka_shooter',
    },
  },
})
