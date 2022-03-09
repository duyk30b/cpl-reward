export enum EVENTS {
  NONE = '',
  AUTH_USER_LOGIN = 'auth_user_login',
  AUTH_USER_CHANGE_EMAIL = 'auth_user_change_email',
  AUTH_USER_CREATED = 'auth_user_created',
  AUTH_USER_LOGOUT = 'auth_user_logout',
  AUTH_USER_CHANGE_PASSWORD = 'auth_user_change_password',
  AUTH_USER_AUTHENTICATOR_STATUS_UPDATED = 'auth_user_authenticator_status_updated',
}

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
