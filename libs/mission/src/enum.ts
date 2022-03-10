export const EVENTS = {
  auth_user_login: {
    //user_id,lang,ip,is_register,time
    user_id: {
      type: 'number',
      description: 'ID of user who just logged in',
    },
    lang: {
      type: 'string',
      description: 'Language',
    },
    ip: {
      type: 'string',
      description: 'IP address',
    },
    is_register: {
      type: 'boolean',
      description: 'Is brand new account',
    },
    time: {
      type: 'number',
      description: 'Time',
    },
  },
  auth_user_change_email: {
    //user_id,old_email,new_email
    user_id: {
      type: 'number',
      description: 'User ID',
    },
    old_email: {
      type: 'string',
      description: 'Old Email',
    },
    new_email: {
      type: 'string',
      description: 'New Email',
    },
  },
  auth_user_created: {
    // uuid,last_login,referrer_code,email,email_verify_at,created_at,updated_at,id,status,type,email_verify_status,' +
    //     'authenticator_verify_status,kyc_verify_status,referred_by_id
    uuid: {
      type: 'number',
      description: 'User UUID',
    },
    last_login: {
      type: 'number',
      description: 'Last login time',
    },
    referrer_code: {
      type: 'string',
      description: 'Referer code of user',
    },
    email: {
      type: 'string',
      description: 'Account Email',
    },
    email_verify_at: {
      type: 'number',
      description: 'Email verify status',
    },
    created_at: {
      type: 'string',
      description: 'Account created at',
    },
    updated_at: {
      type: 'string',
      description: 'Account updated at',
    },
    id: {
      type: 'number',
      description: 'User ID',
    },
    status: {
      type: 'number',
      description: 'Account status',
    },
    type: {
      type: 'number',
      description: 'Account type',
    },
    email_verify_status: {
      type: 'number',
      description: 'Email verify status',
    },
    authenticator_verify_status: {
      type: 'number',
      description: 'Authenticator verify status',
    },
    kyc_verify_status: {
      type: 'number',
      description: 'KYC verify status',
    },
    referred_by_id: {
      type: 'number',
      description: 'Referred by user id',
    },
  },
  auth_user_logout: {
    //user_id,device_id,time
    user_id: {
      type: 'number',
      description: 'User ID',
    },
    device_id: {
      type: 'number',
      description: 'Device ID',
    },
    time: {
      type: 'number',
      description: 'Logout time',
    },
  },
  auth_user_change_password: {
    //user_id,device_id,time
    userId: {
      type: 'number',
      description: 'User ID',
    },
  },
  auth_user_authenticator_status_updated: {
    //status,user_id,otp_secret
    user_id: {
      type: 'number',
      description: 'User ID',
    },
    status: {
      type: 'number',
      description: 'Status',
    },
  },
}
// AUTH_USER_AUTHENTICATOR_STATUS_UPDATED = 'auth_user_authenticator_status_updated',

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
