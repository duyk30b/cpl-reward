import { registerAs } from '@nestjs/config'

export default registerAs('mysql', () => ({
  master: {
    host: process.env.AUTHENTICATE_MYSQL_MASTER_HOST || 'localhost',
    port: process.env.AUTHENTICATE_MYSQL_MASTER_PORT || 3360,
    user: process.env.AUTHENTICATE_MYSQL_MASTER_USER || 'root',
    pass: process.env.AUTHENTICATE_MYSQL_MASTER_PASS || 'password',
    db: process.env.AUTHENTICATE_MYSQL_MASTER_DB || 'db_authenticate',
  },
}))
