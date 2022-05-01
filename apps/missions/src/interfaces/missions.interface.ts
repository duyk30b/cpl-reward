export interface IEventByName {
  msgId: string
  msgName: string
  msgData: any
}

export interface IWriteLog {
  logLevel: string
  traceCode: string
  data: IEvent
  extraData: any
  params: any
}

export interface IEvent {
  msgData: any
  missionId?: number
  campaignId?: number
  msgName: string
  msgId: string
}

export interface IJudgmentCondition {
  eventName: string
  property: string
  operator: string
  value: string
  type?: string
}

export interface IUserCondition {
  property: string
  operator: string
  value: string
  type?: string
}
