export interface IGrantTarget {
  user: string
  amount: string
  currency: string
  wallet: string
  type?: string
  tagIds?: Array<number>
}
