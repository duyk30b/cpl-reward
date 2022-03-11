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
      //user_id,lang,ip,is_register,time
      {
        key: 'user_id',
        type: 'number',
        description: 'ID of user who just logged in',
      },
      {
        key: 'lang',
        type: 'number',
        description: 'ID of user who just logged in',
      },
      {
        key: 'ip',
        type: 'string',
        description: 'IP address',
      },
      {
        key: 'is_register',
        type: 'boolean',
        description: 'Is brand new account',
      },
      {
        key: 'is_register',
        type: 'number',
        description: 'Time',
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
      //     'authenticator_verify_status,kyc_verify_status,referred_by_id
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
    eventName: EVENTS.AUTH_USER_CHANGE_PASSWORD,
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
]
// AUTH_USER_AUTHENTICATOR_STATUS_UPDATED = 'auth_user_authenticator_status_updated',
