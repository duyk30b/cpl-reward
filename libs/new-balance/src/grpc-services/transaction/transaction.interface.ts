import { Observable } from 'rxjs'
import {
  BalanceType,
  OnHoldTransactionStatus,
  TransactionType,
} from './transaction.enum'

export default interface ITransactionService {
  create(data: CreateRequest): Observable<TransactionResponse>
}

export interface CreateRequest {
  userId: string
  items: Array<TransactionItem>
}

interface TransactionItem {
  balanceType: BalanceType
  transactionType: TransactionType
  currency: string
  amount: string
  transactionReferenceId: string
  alternatives?: Array<Alternative>
}

export interface TransactionResponse {
  balanceAccounts: Array<BalanceAccount>
  balanceTransactions: Array<BalanceTransaction>
  onHoldTransactions: Array<OnHoldTransaction>
}

interface BalanceAccount {
  userId: string
  type: BalanceType
  currency: string
}

interface BalanceTransaction {
  id: string
  transactionReferenceId: string
  balanceAccountId: string
  onHoldTransactionId: string
  amount: string
  type: TransactionType
  createdAt: string
}

interface OnHoldTransaction {
  id: string
  holdReferenceId: string
  balanceAccountId: string
  total: string
  filled: string
  status: OnHoldTransactionStatus
  type: TransactionType
  createdAt: string
  updatedAt: string
  rollback: string
}

interface Alternative {
  balanceType: BalanceType
  currency: string
  amount: string
}
