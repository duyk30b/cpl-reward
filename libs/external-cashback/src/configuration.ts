import { registerAs } from '@nestjs/config'

export default registerAs('cashback', () => ({
  url: process.env.CASHBACK_GRPC_URL || '',
}))
