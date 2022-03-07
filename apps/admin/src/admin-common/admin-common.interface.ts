export interface CreateActionLogInput {
  adminId: number
  actionName: string
  contentData: string
}
export interface ListPropertiesByEventInput {
  eventKey: string
}
export interface CreateRewardRule {
  key: string
  currency: string
  limitValue: number
}

export interface UpdateRewardRule extends CreateRewardRule {
  id: number
}
