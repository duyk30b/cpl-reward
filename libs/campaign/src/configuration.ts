import { registerAs } from '@nestjs/config'

export default registerAs('campaign', () => ({
  throttle_checkin_time: 600,
}))
