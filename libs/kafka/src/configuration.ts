import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  uri: process.env.KAFKA_URI,
  client: process.env.ENV + '-' + process.env.KAFKA_CONSUMER + '-client',
  consumer: process.env.ENV + '-' + process.env.KAFKA_CONSUMER,

  auth_user_login: process.env.KAFKA_AUTH_USER_LOGIN,
  auth_user_change_email: process.env.KAFKA_AUTH_USER_CHANGE_EMAIL,
  auth_user_created: process.env.KAFKA_AUTH_USER_CREATED,
  auth_user_logout: process.env.KAFKA_AUTH_USER_LOGOUT,
  auth_user_change_password: process.env.KAFKA_AUTH_USER_CHANGE_PASSWORD,
  auth_user_change_info: process.env.KAFKA_AUTH_USER_CHANGE_INFO,
  auth_user_authenticator_status_updated:
    process.env.KAFKA_AUTH_USER_AUTHENTICATOR_STATUS_UPDATED,
  auth_user_kyc_status_updated: process.env.KAFKA_AUTH_USER_KYC_STATUS_UPDATED,
  auth_user_kyc_registered: process.env.KAFKA_AUTH_USER_KYC_REGISTERED,
  auth_user_kyc_auto_kyc_finished:
    process.env.KAFKA_AUTH_USER_KYC_AUTO_KYC_FINISHED,
  auth_user_change_lv: process.env.KAFKA_AUTH_USER_CHANGE_LV,

  bce_trading_matched: process.env.KAFKA_BCE_TRADING_MATCHED,
  bce_deposit: process.env.KAFKA_BCE_DEPOSIT,
  bce_withdraw: process.env.KAFKA_BCE_WITHDRAW,

  exchange_confirm_order_match: process.env.KAFKA_EXCHANGE_CONFIRM_ORDER_MATCH,

  high_low_transfer_balance: process.env.KAFKA_HIGH_LOW_TRANSFER_BALANCE,
  high_low_create: process.env.KAFKA_HIGH_LOW_CREATE,
  high_low_win: process.env.KAFKA_HIGH_LOW_WIN,
  high_low_lose: process.env.KAFKA_HIGH_LOW_LOSE,
  high_low_cancel: process.env.KAFKA_HIGH_LOW_CANCEL,
  reward_user_check_in: process.env.KAFKA_REWARD_USER_CHECK_IN,
}))
