import { registerAs } from '@nestjs/config'

export const KafkaConfig = registerAs('kafka', () => ({
  brokers: (process.env.KAFKA_BORKERS || '').split(','),
  group_id: process.env.KAFKA_GROUP_ID,
  client_id: process.env.KAFKA_GROUP_ID + '-client',

  event: {
    auth: {
      user_created: process.env.KAFKA_AUTH_USER_CREATED,
      user_login: process.env.KAFKA_AUTH_USER_LOGIN,
      user_logout: process.env.KAFKA_AUTH_USER_LOGOUT,
      user_change_email: process.env.KAFKA_AUTH_USER_CHANGE_EMAIL,
      user_change_password: process.env.KAFKA_AUTH_USER_CHANGE_PASSWORD,
      user_change_lv: process.env.KAFKA_AUTH_USER_CHANGE_LV,
      user_change_info: process.env.KAFKA_AUTH_USER_CHANGE_INFO,
      user_authenticator_status_updated:
        process.env.KAFKA_AUTH_USER_AUTHENTICATOR_STATUS_UPDATED,
      user_kyc_status_updated: process.env.KAFKA_AUTH_USER_KYC_STATUS_UPDATED,
      user_kyc_registered: process.env.KAFKA_AUTH_USER_KYC_REGISTERED,
      user_kyc_auto_kyc_finished:
        process.env.KAFKA_AUTH_USER_KYC_AUTO_KYC_FINISHED,
    },
    highlow: {
      transfer_balance: process.env.KAFKA_HIGH_LOW_TRANSFER_BALANCE,
      create: process.env.KAFKA_HIGH_LOW_CREATE,
      win: process.env.KAFKA_HIGH_LOW_WIN,
      lose: process.env.KAFKA_HIGH_LOW_LOSE,
      cancel: process.env.KAFKA_HIGH_LOW_CANCEL,
    },
    bce: {
      trading_matched: process.env.KAFKA_BCE_TRADING_MATCHED,
      deposit: process.env.KAFKA_BCE_DEPOSIT,
      withdraw: process.env.KAFKA_BCE_WITHDRAW,
    },
    reward: {
      user_check_in: process.env.KAFKA_REWARD_USER_CHECK_IN,
    },
    exchange: {
      confirm_order_match: process.env.KAFKA_EXCHANGE_CONFIRM_ORDER_MATCH,
    },
  },
}))
