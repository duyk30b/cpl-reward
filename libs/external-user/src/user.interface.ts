import { Expose } from 'class-transformer'
import { TransformInt } from '@lib/mysql/decorators/transform.decorator'

export interface UserById {
  id: string
}

export class User {
  @Expose()
  id: string

  @Expose()
  uuid: string

  @Expose()
  name: string

  // @Expose()
  // phone: string

  // @Expose({ name: 'phone_country' })
  // phoneCountry: string

  @Expose()
  email: string

  @Expose()
  type: number

  // @Exclude()
  // password: string

  // @Exclude()
  // passwordEncryptor: number

  // @Exclude()
  // salt: string

  @Expose()
  status: number

  @Expose({ name: 'referrer_code' })
  referrerCode: string

  @Expose({ name: 'referred_by_id' })
  referredById: string

  @Expose({ name: 'fb_id' })
  fbId: string

  @Expose({ name: 'gg_id' })
  ggId: string

  @Expose()
  checkpoint: string

  @Expose({ name: 'last_login' })
  @TransformInt()
  lastLogin: number

  @Expose({ name: 'phone_verify_at' })
  @TransformInt()
  phoneVerifyAt: number

  @Expose({ name: 'email_verify_at' })
  @TransformInt()
  emailVerifyAt: number

  @Expose({ name: 'authenticator_verify_at' })
  @TransformInt()
  authenticatorVerifyAt: number

  @TransformInt()
  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  @TransformInt()
  updatedAt: number

  @Expose({ name: 'bce_updated_at' })
  @TransformInt()
  bceUpdatedAt: number

  @Expose({ name: 'email_verify_status' })
  emailVerifyStatus: number

  @Expose({ name: 'authenticator_verify_status' })
  authenticatorVerifyStatus: number

  @Expose({ name: 'kyc_verify_status' })
  kycVerifyStatus: number

  // @Exclude()
  // otpSecret: string

  @Expose({ name: 'user_info_status' })
  userInfoStatus: number

  @Expose({ name: 'last_password_change' })
  @TransformInt()
  lastPasswordChange: number

  // @Expose({ name: 'accept_law_status' })
  // acceptLawStatus: number

  @Expose({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'apple_id' })
  appleId: string

  @Expose({ name: 'channel_id' })
  channelId: number
}
