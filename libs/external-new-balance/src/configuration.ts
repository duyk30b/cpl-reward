import { registerAs } from '@nestjs/config'

export default registerAs('new_balance', () => ({
  grpc_url: process.env.NEW_BALANCE_GRPC_URL || 'localhost:6000',
}))
