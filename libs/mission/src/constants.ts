import { EVENTS } from './enum'

export const MISSION_SEARCH_FIELD_MAP = {
  title: 'mission.title',
  title_jp: 'mission.titleJp',
  guide_link: 'mission.guideLink',
  guide_link_jp: 'mission.guideLinkJp',
  detail_explain: 'mission.detailExplain',
  detail_explain_jp: 'mission.detailExplainJp',
}

export const MISSION_SORT_FIELD_MAP = {
  title: 'mission.title',
  title_jp: 'mission.titleJp',
  guide_link: 'mission.guideLink',
  guide_link_jp: 'mission.guideLinkJp',
  detail_explain: 'campaign.detailExplain',
  detail_explain_jp: 'campaign.detailExplainJp',
  opening_date: 'campaign.openingDate',
  closing_date: 'campaign.closingDate',
  completed: 'completed',
}

export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
}

export const USER_TYPE = {
  NORMAL: 1,
  BOT: 2,
}

export const USER_EMAIL_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
}

export const USER_AUTHENTICATOR_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
}

export const USER_KYC_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
  PENDING: 3,
  REJECTED: 4,
}

export const KYC_TYPE = {
  PERSONAL: 1,
  ENTERPRISE: 2,
}

export const KYC_ID_DOCUMENT_TYPE = {
  PASSPORT: 1,
  ID_CARD: 2,
  DRIVING_LICENCE: 3,
  OTHERS: 4,
  RESIDENCE_CARD: 5,
  NUMBER_CARD: 6,
}

export const KYC_STATUS = {
  ACCEPT: 1,
  REJECT: 2,
  PENDING: 3,
  APPROVED_PAPER: 4,
  NEW: 5,
  AUTO_KYC_PROCESSED: 7,
  PENDING_PAPER: 8,
}

export const USER_INFO_STATUS = {
  UPDATED: 1,
  NOT_UPDATED: 2,
}

export const USER_CONDITION_TYPES = {
  kyc_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_KYC_VERIFY_STATUS,
  },
  user_info_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_INFO_STATUS,
  },
  authenticator_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_AUTHENTICATOR_VERIFY_STATUS,
  },
  email_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_EMAIL_VERIFY_STATUS,
  },
  referrer_code: {
    type: 'string',
    original: 'number',
    display: 'string',
  },
  account_lv: {
    type: 'string',
    original: 'number',
    display: 'number',
  },
  channel_id: {
    type: 'string',
    original: 'number',
    display: 'number',
  },
}

export const INFO_EVENTS = [
  {
    eventName: EVENTS.AUTH_USER_LOGIN,
    properties: [
      //user_id,lang,ip,is_register,time,channel_id
      {
        key: 'user_id',
        type: 'string',
        display: 'number',
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
        type: 'string',
        display: 'number',
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
        type: 'string',
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
        type: 'string',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Account status',
        display: 'enum',
        options: USER_STATUS,
      },
      {
        key: 'type',
        type: 'number',
        description: 'Account type',
        display: 'enum',
        options: USER_TYPE,
      },
      {
        key: 'email_verify_status',
        type: 'number',
        description: 'Email verify status',
        display: 'enum',
        options: USER_EMAIL_VERIFY_STATUS,
      },
      {
        key: 'authenticator_verify_status',
        type: 'number',
        description: 'Authenticator verify status',
        display: 'enum',
        options: USER_AUTHENTICATOR_VERIFY_STATUS,
      },
      {
        key: 'kyc_verify_status',
        type: 'number',
        description: 'KYC verify status',
        display: 'enum',
        options: USER_KYC_VERIFY_STATUS,
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
        type: 'string',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'device_id',
        type: 'string',
        display: 'number',
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
      //user_id
      {
        key: 'user_id',
        type: 'string',
        display: 'number',
        description: 'User ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_INFO,
    properties: [
      //user_id
      {
        key: 'user_id',
        type: 'string',
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
        type: 'string',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Status',
        display: 'enum',
        options: USER_AUTHENTICATOR_VERIFY_STATUS,
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_KYC_REGISTERED,
    properties: [
      {
        key: 'id',
        type: 'string',
        display: 'number',
        description: 'ID',
      },
      {
        key: 'user_id',
        type: 'string',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'number',
        description: 'Type',
        display: 'enum',
        options: KYC_TYPE,
      },
      {
        key: 'provider',
        type: 'number',
        description: 'KYC Provider ID',
      },
      {
        key: 'id_document_type',
        type: 'number',
        description: 'Document type ID',
        display: 'enum',
        options: KYC_ID_DOCUMENT_TYPE,
      },
      {
        key: 'country_id',
        type: 'number',
        description: 'Country ID',
      },
      {
        key: 'user_kyc_history_id',
        type: 'string',
        display: 'number',
        description: 'KYC history id',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Status',
        display: 'enum',
        options: KYC_STATUS,
      },
      {
        key: 'cynopsis_processing',
        type: 'boolean',
        description: 'Is Cynopsis processing',
      },
      {
        key: 'created_at',
        type: 'number',
        display: 'number',
        description: 'Created at (unix time)',
      },
      {
        key: 'updated_at',
        type: 'number',
        display: 'number',
        description: 'Updated at (unix time)',
      },
    ],
  },

  {
    eventName: EVENTS.AUTH_USER_KYC_AUTO_KYC_FINISHED,
    properties: [
      {
        key: 'id',
        type: 'string',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'pass',
        type: 'boolean',
        description: 'Is passed Auto KYC',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_LV,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        description: 'User ID',
      },
      {
        key: 'old_level',
        type: 'number',
        description: 'Account level before change',
      },
      {
        key: 'new_level',
        type: 'number',
        description: 'Account level after change',
      },
    ],
  },

  {
    eventName: EVENTS.BCE_TRADING_MATCHED,
    properties: [
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'user_id',
        type: 'number',
        description: 'User ID',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency',
      },
      {
        key: 'coin',
        type: 'string',
        description: 'Coin',
      },
      {
        key: 'quantity',
        type: 'string',
        display: 'number',
        description: 'Quantity',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.BCE_DEPOSIT,
    properties: [
      //id,transaction_id, user_id, type, currency, amount, fee, is_first_time
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
        type: 'string',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'string',
        description: 'Type of transaction (values: deposit, ...?)',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency (lowercase)',
      },
      {
        key: 'amount',
        type: 'string', // Type khi gửi về từ kafka là string, nhưng bản chất là giá trị là number
        display: 'number',
        description: 'Amount',
      },
      {
        key: 'fee',
        type: 'string', // Type khi gửi về từ kafka là string, nhưng bản chất là giá trị là number
        display: 'number',
        description: 'Fee',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is first time the use do this action',
      },
    ],
  },
  // Kafka chưa có event này (update 27/03/2022)
  // {
  //   eventName: EVENTS.BCE_WITHDRAW,
  //   properties: [
  //     //id,transaction_id, user_id, type, currency, amount, fee, is_first_time
  //     {
  //       key: 'id',
  //       type: 'number',
  //       description: 'ID',
  //     },
  //     {
  //       key: 'transaction_id',
  //       type: 'string',
  //       description: 'Transaction ID',
  //     },
  //     {
  //       key: 'user_id',
  //       type: 'string',
  //       description: 'User ID',
  //     },
  //     {
  //       key: 'type',
  //       type: 'string',
  //       description: 'Type',
  //     },
  //     {
  //       key: 'currency',
  //       type: 'string',
  //       description: 'Currency (lowercase)',
  //     },
  //     {
  //       key: 'amount',
  //       type: 'string',
  //       display: 'number',
  //       description: 'Amount',
  //     },
  //     {
  //       key: 'fee',
  //       type: 'string',
  //       display: 'number',
  //       description: 'Fee',
  //     },
  //     {
  //       key: 'is_first_time',
  //       type: 'boolean',
  //       description: 'Is first time the user do this action',
  //     },
  //   ],
  // },
  {
    eventName: EVENTS.HIGH_LOW_TRANSFER_BALANCE,
    properties: [
      {
        key: 'id',
        type: 'string',
        display: 'number',
        description: 'Transfer ID',
      },
      {
        key: 'user_id',
        type: 'string',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'bcast_balance',
        type: 'string',
        display: 'number',
        description: 'BCAST balance',
      },
      {
        key: 'bcast_available_balance',
        type: 'string',
        display: 'number',
        description: 'BCAST available balance',
      },
      {
        key: 'usdt_balance',
        type: 'string',
        display: 'number',
        description: 'USDT balance',
      },
      {
        key: 'usdt_available_balance',
        type: 'string',
        display: 'number',
        description: 'USDT available balance',
      },
      {
        key: 'account_type',
        type: 'number',
        description: '1 is user, others is BOT',
      },
      // session_id: No idea with this field
      // created_at, updated_at. Example: 2021-07-23 07:54:12. No idea with this type
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CREATE,
    properties: [
      {
        key: 'user_id',
        type: 'string',
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
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_LOST,
    properties: [
      {
        key: 'user_id',
        type: 'string',
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
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CANCEL,
    properties: [
      {
        key: 'user_id',
        type: 'string',
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
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_WIN,
    properties: [
      {
        key: 'user_id',
        type: 'string',
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
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
]
