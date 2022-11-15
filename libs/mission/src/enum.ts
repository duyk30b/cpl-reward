export enum DELIVERY_METHOD_WALLET {
  REWARD_BALANCE = 'reward_balance',
  REWARD_CASHBACK = 'reward_cashback',
  REWARD_DIVIDEND = 'reward_dividend',
  DIRECT_BALANCE = 'direct_balance',
  DIRECT_CASHBACK = 'direct_cashback',
  DIRECT_DIVIDEND = 'direct_dividend',
}

export enum DELIVERY_METHOD {
  MANUAL = 1,
  AUTO = 2,
}

export enum WALLET {
  BALANCE = 1,
  CASHBACK = 2,
  DIVIDEND = 3,
}

export enum GRANT_TARGET_USER {
  USER = 'user',
  REFERRAL_USER = 'referral_user',
}

export enum GRANT_METHOD {
  FIXED = 'fixed',
  PERCENT = 'percent',
}

export enum PROPERTY_TO_CALCULATE_AMOUNT {
  INVEST = 'invest',
}

export enum EVENTS {
  AUTH_USER_CREATED = 'auth_user_created',
  AUTH_USER_CHANGE_EMAIL = 'auth_user_change_email',
  AUTH_USER_LOGIN = 'auth_user_login',
  AUTH_USER_LOGOUT = 'auth_user_logout',
  AUTH_USER_CHANGE_PASSWORD = 'auth_user_change_password',
  AUTH_USER_AUTHENTICATOR_STATUS_UPDATED = 'auth_user_authenticator_status_updated',
  AUTH_USER_KYC_STATUS_UPDATED = 'auth_user_kyc_status_updated',
  AUTH_USER_KYC_REGISTERED = 'auth_user_kyc_registered',
  AUTH_USER_KYC_AUTO_KYC_FINISHED = 'auth_user_kyc_auto_kyc_finished',
  AUTH_USER_CHANGE_LV = 'auth_user_change_lv',
  AUTH_USER_CHANGE_INFO = 'auth_user_change_info',

  // BCE
  BCE_TRADING_MATCHED = 'bce_trading_matched',
  BCE_DEPOSIT = 'bce_deposit',
  BCE_WITHDRAW = 'bce_withdraw',

  // New Exchange
  EXCHANGE_CONFIRM_ORDER_MATCH = 'exchange_confirm_order_match',

  // BO
  HIGH_LOW_TRANSFER_BALANCE = 'high_low_transfer_balance',
  HIGH_LOW_CREATE = 'high_low_create',
  HIGH_LOW_WIN = 'high_low_win',
  HIGH_LOW_LOSE = 'high_low_lose',
  HIGH_LOW_CANCEL = 'high_low_cancel',

  // reward
  REWARD_USER_CHECK_IN = 'reward_user_check_in',
}

export enum MISSION_IS_ACTIVE {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum MISSION_STATUS {
  RUNNING = 1,
  OUT_OF_BUDGET = 2,
  ENDED = 3,
  COMING_SOON = 4,
}

export enum TARGET_TYPE {
  HYBRID = 1,
  ONLY_MAIN = 2,
  ONLY_REFERRED = 3,
}

export enum UserType {
  User = 1,
  BotA = 2,
  BotP = 3,
  Gatekeeper = 4,
}

export enum OrderType {
  Buy = 1,
  Sell = 2,
}
