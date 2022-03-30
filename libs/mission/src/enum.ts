export enum GRANT_TARGET_WALLET {
  REWARD_BALANCE = 'reward_balance',
  REWARD_CASHBACK = 'reward_cashback',
  REWARD_DIVIDEND = 'reward_dividend',
  DIRECT_BALANCE = 'direct_balance',
  DIRECT_CASHBACK = 'direct_cashback',
  DIRECT_DIVIDEND = 'direct_dividend',
}

export enum GRANT_TARGET_USER {
  USER = 'user',
  REFERRAL_USER = 'referral_user',
}

export enum EVENTS {
  AUTH_USER_LOGIN = 'auth_user_login',
  AUTH_USER_CHANGE_EMAIL = 'auth_user_change_email',
  AUTH_USER_CREATED = 'auth_user_created',
  AUTH_USER_LOGOUT = 'auth_user_logout',
  AUTH_USER_CHANGE_PASSWORD = 'auth_user_change_password',
  AUTH_USER_CHANGE_INFO = 'auth_user_change_info',
  AUTH_USER_AUTHENTICATOR_STATUS_UPDATED = 'auth_user_authenticator_status_updated',
  AUTH_USER_KYC_REGISTERED = 'auth_user_kyc_registered',
  AUTH_USER_KYC_AUTO_KYC_FINISHED = 'auth_user_kyc_auto_kyc_finished',
  AUTH_USER_CHANGE_LV = 'auth_user_change_lv',

  // BCE
  BCE_TRADING_MATCHED = 'bce_trading_matched',
  BCE_DEPOSIT = 'bce_deposit',
  BCE_WITHDRAW = 'bce_withdraw',

  // BO
  HIGH_LOW_TRANSFER_BALANCE = 'high_low_transfer_balance',
  HIGH_LOW_CREATE = 'high_low_create',
  HIGH_LOW_WIN = 'high_low_win',
  HIGH_LOW_LOST = 'high_low_lost',
  HIGH_LOW_CANCEL = 'high_low_cancel',
}

export enum IS_ACTIVE_MISSION {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum STATUS_MISSION {
  RUNNING = 0,
  OUT_OF_BUDGET = 1,
  ENDED = 2,
  INACTIVE = 3,
}

export enum TARGET_TYPE {
  HYBRID = 0,
  ONLY_MAIN = 1,
  ONLY_REFERRED = 2,
}
