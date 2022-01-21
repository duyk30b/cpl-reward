import { registerAs } from '@nestjs/config'

export default registerAs('affiliate_internal', () => ({
  grpc_connection_url: process.env.GRPC_CONNECTION_URL || 'localhost:12345',
}))
