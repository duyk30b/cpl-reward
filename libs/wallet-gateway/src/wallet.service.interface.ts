export interface WalletServiceInterface {
  changeUserBalance?(
    userId: string,
    amount: string,
    currency: string,
    type: string,
    referenceId: string,
    data: any,
  ): Promise<ChangeUserWalletResult>

  changeUserCashback?(ChangeUserCashback): Promise<ChangeUserWalletResult>
}

export interface ChangeUserWalletResult {
  result: boolean
  message: any
}

export interface ChangeUserCashbackInput {
  user_id: string
  currency: string
  amount: string
  referenceId: string
  data: any
}
