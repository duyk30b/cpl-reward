import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import ITransactionService, {
  CreateRequest,
  TransactionResponse,
} from './transaction.interface'

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name)
  private transactionService: ITransactionService

  constructor(@Inject('NEW_BALANCE_GRPC') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.transactionService = this.clientGrpc.getService('TransactionService')
  }

  async createTransaction(data: CreateRequest): Promise<TransactionResponse> {
    const res = await lastValueFrom(this.transactionService.create(data))
    return res
  }
}
