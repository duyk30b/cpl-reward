import { EVENTS } from './enum'

export const MISSION_SEARCH_FIELD_MAP = {
  title: 'mission.title',
}

export const MISSION_SORT_FIELD_MAP = {
  title: 'mission.title',
  detail_explain: 'campaign.detailExplain',
  opening_date: 'campaign.openingDate',
  closing_date: 'campaign.closingDate',
}

export const INFO_EVENTS = [
  {
    eventName: EVENTS.AUTH_USER_LOGIN,
    properties: [
      //user_id,lang,ip,is_register,time,channel_id
      {
        key: 'user_id',
        type: 'number',
        description: 'ID of user who just logged in',
      },
      {
        key: 'lang',
        type: 'string',
        description: 'Language of user (en/jp...)',
      },
      {
        key: 'ip',
        type: 'string',
        description: 'IP address',
      },
      {
        key: 'is_register',
        type: 'boolean',
        description: 'Is brand new account?',
      },
      {
        key: 'time',
        type: 'number',
        description: 'Register time (unix timestamp)',
      },
      {
        key: 'channel_id',
        type: 'number',
        description: 'Channel ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_EMAIL,
    properties: [
      //user_id,old_email,new_email
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'old_email',
        type: 'string',
        description: 'Old Email',
      },
      {
        key: 'new_email',
        type: 'string',
        description: 'New Email',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CREATED,
    properties: [
      // uuid,last_login,referrer_code,email,email_verify_at,created_at,updated_at,id,status,type,email_verify_status,' +
      //     'authenticator_verify_status,kyc_verify_status,referred_by_id, channel_id
      {
        key: 'uuid',
        type: 'number',
        description: 'User UUID',
      },
      {
        key: 'last_login',
        type: 'number',
        description: 'Last login time',
      },
      {
        key: 'referrer_code',
        type: 'string',
        description: 'Referer code of user',
      },
      {
        key: 'email',
        type: 'string',
        description: 'Account Email',
      },
      {
        key: 'email_verify_at',
        type: 'number',
        description: 'Email verify status',
      },
      {
        key: 'created_at',
        type: 'string',
        description: 'Account created at',
      },
      {
        key: 'updated_at',
        type: 'string',
        description: 'Account updated at',
      },
      {
        key: 'id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Account status',
      },
      {
        key: 'type',
        type: 'number',
        description: 'Account type',
      },
      {
        key: 'email_verify_status',
        type: 'number',
        description: 'Email verify status',
      },
      {
        key: 'authenticator_verify_status',
        type: 'number',
        description: 'Authenticator verify status',
      },
      {
        key: 'kyc_verify_status',
        type: 'number',
        description: 'KYC verify status',
      },
      {
        key: 'referred_by_id',
        type: 'number',
        description: 'Referred by user id',
      },
      {
        key: 'channel_id',
        type: 'number',
        description: 'Channel ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_LOGOUT,
    properties: [
      //user_id,device_id,time
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'device_id',
        type: 'number',
        description: 'Device ID',
      },
      {
        key: 'time',
        type: 'number',
        description: 'Logout time',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_PASSWORD,
    properties: [
      //user_id,device_id,time
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_AUTHENTICATOR_STATUS_UPDATED,
    properties: [
      //status,user_id,otp_secret
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Status',
      },
    ],
  },
  {
    eventName: EVENTS.BCE_DEPOSIT,
    properties: [
      //id,transaction_id, user_id, type, currency, amount, fee, is_first
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'transaction_id',
        type: 'string',
        description: 'Transaction ID',
      },
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'string',
        description: 'Type',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency',
      },
      {
        key: 'amount',
        type: 'string',
        description: 'Amount',
      },
      {
        key: 'fee',
        type: 'string',
        description: 'Fee',
      },
      {
        key: 'is_first',
        type: 'boolean',
        description: 'Is First',
      },
    ],
  },
  {
    eventName: EVENTS.BCE_WITHDRAW,
    properties: [
      //id,transaction_id, user_id, type, currency, amount, fee, is_first
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'transaction_id',
        type: 'string',
        description: 'Transaction ID',
      },
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'string',
        description: 'Type',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency',
      },
      {
        key: 'amount',
        type: 'string',
        description: 'Amount',
      },
      {
        key: 'fee',
        type: 'string',
        description: 'Fee',
      },
      {
        key: 'is_first',
        type: 'boolean',
        description: 'Is First',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CREATE,
    properties: [
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      {
        key: 'created_at',
        type: 'string',
        description: 'Created At',
      },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      {
        key: 'updated_at',
        type: 'string',
        description: 'Updated At',
      },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_LOST,
    properties: [
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      {
        key: 'created_at',
        type: 'string',
        description: 'Created At',
      },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      {
        key: 'updated_at',
        type: 'string',
        description: 'Updated At',
      },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CANCEL,
    properties: [
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      {
        key: 'created_at',
        type: 'string',
        description: 'Created At',
      },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      {
        key: 'updated_at',
        type: 'string',
        description: 'Updated At',
      },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_WIN,
    properties: [
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      {
        key: 'created_at',
        type: 'string',
        description: 'Created At',
      },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      {
        key: 'updated_at',
        type: 'string',
        description: 'Updated At',
      },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
    ],
  },
]
