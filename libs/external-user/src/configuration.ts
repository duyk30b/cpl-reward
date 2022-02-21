import { registerAs } from '@nestjs/config'

export default registerAs('external_user', () => ({
  grpc_url: process.env.GRPC_USER_URL || 'localhost:99999',
}))
