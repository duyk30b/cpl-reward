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
      bce: {
        host: process.env.BCE_SLAVE_DB_HOST || 'localhost',
        port: process.env.BCE_SLAVE_DB_PORT || 3360,
        user: process.env.BCE_SLAVE_DB_USERNAME || 'root',
        pass: process.env.BCE_SLAVE_DB_PASSWORD || 'password',
        db: process.env.BCE_SLAVE_DB_DATABASE || 'reward',
      },
    },
  },
  missions: {
    mongo: {
      dsn: process.env.MONGO_DSN || 'mongodb://localhost:27017/kafka_shooter',
    },
  },
})
