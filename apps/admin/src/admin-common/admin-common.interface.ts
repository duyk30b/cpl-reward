export interface CreateActionLogInput {
  adminId: number
  actionName: string
  contentData: string
}
export interface ListPropertiesByEventInput {
  eventKey: string
}
