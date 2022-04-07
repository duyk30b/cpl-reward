import * as dotenv from 'dotenv'
import * as path from 'path'

const p = path.join(process.cwd(), `../.env`)
const dotEnvOptions = {
  path: p,
}
dotenv.config(dotEnvOptions)
const RedisQueue = {
  rq_reward_missions:
    process.env.ENV + process.env.RQ_REWARD_MISSIONS || 'dev:reward:missions',
}

export default RedisQueue
