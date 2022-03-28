import db from './db'

export = {
  type: 'mysql',
  host: db().reward.mysql.master.host,
  port: parseInt(db().reward.mysql.master.port.toString()),
  username: db().reward.mysql.master.user,
  password: db().reward.mysql.master.pass,
  database: db().reward.mysql.master.db,
  migrations: ['migration/*{.ts,.js}'],
  migrationsTransactionMode: 'each',
  cli: {
    migrationsDir: 'migration',
  },
}
