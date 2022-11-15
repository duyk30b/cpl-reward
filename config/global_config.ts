export default () => ({
  env: process.env.ENV || 'dev',
  app_name: process.env.APP_NAME || 'REWARD',
  enable_save_log: process.env.ENABLE_SAVE_LOG == 'true',
})
