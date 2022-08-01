export enum BalanceType {
  UNKNOWN = 0,
  CASHBACK = 1,
  BO = 2,
  EXCHANGE = 3,
}

export enum TransactionType {
  UNKNOWN = 0,
  TRADING_FEE = 1,
  WITHDRAW = 2,
  WITHDRAW_FEE = 3,
  DEPOSIT = 4,
  DEPOSIT_FEE = 5,
  TRANSFER = 6,
  TRANSFER_FEE = 7,
  AFFILIATE = 8,
  MANUALLY = 9,
  BO_TRADING = 10,
  BO_TRADING_FEE = 11,
  REWARD = 12,
  BO_TRANSFER = 13,
  BO_TRANSFER_FEE = 14,
  DIVIDEND = 15,
  COMMISSION = 16,
  CAMPAIGN = 17,
  TRADING = 18,
}

export enum OnHoldTransactionStatus {
  NEW = 0,
  PARTIAL_FILLED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}
