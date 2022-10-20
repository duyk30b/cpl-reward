export interface IGrantTarget {
  user: string
  grantMethod: string
  amount: string
  propertyToCalculateAmount: string
  currency: string
  wallet: string
  type?: string
  tagIds?: Array<number>
}
