import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_URI,
  client: process.env.ENV + '-' + process.env.KAFKA_CONSUMER + '-client',
  consumer: process.env.ENV + '-' + process.env.KAFKA_CONSUMER,
  auth_user_login: process.env.ENV + '_auth_user_login',
  auth_user_change_email: process.env.ENV + '_auth_user_change_email',
  auth_user_created: process.env.ENV + '_auth_user_created',
  auth_user_logout: process.env.ENV + '_auth_user_logout',
  auth_user_change_password: process.env.ENV + '_auth_user_change_password',
  auth_user_change_info: process.env.ENV + '_auth_user_change_info',
  auth_user_authenticator_status_updated:
    process.env.ENV + '_auth_user_authenticator_status_updated',
  auth_user_kyc_status_updated:
    process.env.ENV + '_auth_user_kyc_status_updated',
  auth_user_kyc_registered: process.env.ENV + '_auth_user_kyc_registered',
  auth_user_kyc_auto_kyc_finished:
    process.env.ENV + '_auth_user_kyc_auto_kyc_finished',
  auth_user_change_lv: process.env.ENV + '_auth_user_change_lv',

  // BCE sử dụng
  bce_trading_matched:
    (process.env.ENV == 'prod-v2' ? 'production' : process.env.ENV) +
    '_bce_trading_matched',
  bce_deposit:
    (process.env.ENV == 'prod-v2' ? 'production' : process.env.ENV) +
    '_bce_deposit',
  bce_withdraw:
    (process.env.ENV == 'prod-v2' ? 'production' : process.env.ENV) +
    '_bce_withdraw',

  high_low_transfer_balance: process.env.ENV + '_high_low_transfer_balance',
  high_low_create: process.env.ENV + '_high_low_create',
  high_low_win: process.env.ENV + '_high_low_win',
  high_low_lost: process.env.ENV + '_high_low_lost',
  high_low_cancel: process.env.ENV + '_high_low_cancel',

  // reward
  reward_user_check_in: process.env.ENV + '_reward_user_check_in',
}))
