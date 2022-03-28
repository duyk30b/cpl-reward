import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_URI,
  consumer: process.env.ENV + '-' + process.env.KAFKA_CONSUMER,
  auth_user_login: process.env.ENV + '_auth_user_login',
  auth_user_change_email: process.env.ENV + '_auth_user_change_email',
  auth_user_created: process.env.ENV + '_auth_user_created',
  auth_user_logout: process.env.ENV + '_auth_user_logout',
  auth_user_change_password: process.env.ENV + '_auth_user_change_password',
  auth_user_authenticator_status_updated:
    process.env.ENV + '_auth_user_authenticator_status_updated',

  // bce_trading_matched: process.env.ENV + '_bce_trading_matched',
  bce_deposit: process.env.ENV + '_bce_deposit',
  bce_withdraw: process.env.ENV + '_bce_withdraw',

  high_low_create: process.env.ENV + '_high_low_create',
  high_low_win: process.env.ENV + '_high_low_win',
  high_low_lost: process.env.ENV + '_high_low_lost',
  high_low_cancel: process.env.ENV + '_high_low_cancel',
}))
