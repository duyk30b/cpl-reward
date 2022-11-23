export enum Environment {
  Local = 'local',
  Development = 'dev',
  Production = 'prod',
}

export enum LogLevel {
  Debug = 'debug',
  Error = 'error',
  Log = 'log',
  Verbose = 'verbose',
  Warn = 'warn',
}

export enum SortType {
  asc = 'ASC',
  desc = 'DESC',
}

export enum TypeEvent {
  AUTH = 'AUTH_',
  BCE = 'BCE_',
  HIGH_LOW = 'HIGH_LOW_',
}

export enum EventEmitterType {
  CREATE_MISSION_USER_LOG = 'create_mission_user_log',
  TAGGING_FOR_REWARD = 'tagging_for_reward',
  WRITE_LOG = 'write_log',
}

export enum MissionUserLogNoteCode {
  SUCCESS = 1,
  FAILED_RAISE_REWARD = 2,
  FAILED_RELEASE_MONEY = 3,
  FAILED_CREATE_HISTORY = 4,
  FAILED_DUE_TO_OUT_OF_BUDGET = 5,
}

export enum MissionUserLogStatus {
  IGNORE = 0,
  NEED_TO_RESOLVE = 1,
  RESOLVED = 2,
  RETRYING = 3,
  RESOLVED_BY_RETRY = 4,
}

export enum ErrorMessage {
  INVALID_CAMPAIGN_TIME = 'CAMPAIGN.UPDATE.INVALID_TIME',
  INVALID_CAMPAIGN_TYPE = 'CAMPAIGN.UPDATE.INVALID_TYPE',
  DUPLICATE_MISSION_PRIORITY = 'MISSION.DUPLICATE_PRIORITY',
  INVALID_MISSION_TIME = 'MISSION.INVALID_TIME',
}
