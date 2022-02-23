import { registerAs } from '@nestjs/config'

export default registerAs('mission', () => ({
  auth_user_login_properties: 'user_id,lang,ip,is_register,time',
  auth_user_change_email_properties: 'user_id,old_email,new_email',
  auth_user_created_properties:
    'uuid,last_login,referrer_code,email,email_verify_at,created_at,updated_at,id,status,type,email_verify_status,' +
    'authenticator_verify_status,kyc_verify_status,referred_by_id',
  auth_user_logout_properties: 'user_id,device_id,time',
  auth_user_change_password_properties: 'userId',
  auth_user_authenticator_status_updated_properties:
    'status,user_id,otp_secret',
}))
