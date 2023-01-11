export enum EAuthEvent {
  USER_CREATE = 'kafka.event.auth.user_created',
  USER_LOGIN = 'kafka.event.auth.user_login',
  USER_LOGOUT = 'kafka.event.auth.user_logout',
  USER_CHANGE_EMAIL = 'kafka.event.auth.user_change_email',
  USER_CHANGE_PASSWORD = 'kafka.event.auth.user_change_password',
  USER_CHANGE_LV = 'kafka.event.auth.user_change_lv',
  USER_CHANGE_INFO = 'kafka.event.auth.user_change_info',
  USER_AUTHENTICATOR_STATUS_UPDATED = 'kafka.event.auth.user_authenticator_status_updated',
  USER_KYC_STATUS_UPDATED = 'kafka.event.auth.user_kyc_status_updated',
  USER_KYC_REGISTERED = 'kafka.event.auth.user_kyc_registered',
  USER_KYC_AUTO_KYC_FINISHED = 'kafka.event.auth.user_kyc_auto_kyc_finished',
}

export enum EHightLowEvent {
  WIN = 'kafka.event.highlow.win',
  LOSE = 'kafka.event.highlow.lose',
  CANCEL = 'kafka.event.highlow.cancel',
  CREATE = 'kafka.event.highlow.create',
  TRANSFER_BALANCE = 'kafka.event.highlow.transfer_balance',
}

export enum EBceEvent {
  TRADING_MATCHED = 'kafka.event.bce.trading_matched',
  DEPOSIT = 'kafka.event.bce.deposit',
  WITHDRAW = 'kafka.event.bce.withdraw',
}

export enum ERewardEvent {
  USER_CHECK_IN = 'kafka.event.reward.user_check_in',
}

export enum EExchangeEvent {
  CONFIRM_ORDER_MATCH = 'kafka.event.exchange.confirm_order_match',
}
