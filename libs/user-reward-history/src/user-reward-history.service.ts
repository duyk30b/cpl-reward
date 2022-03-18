import { Injectable } from '@nestjs/common'
import { CreateUserRewardHistoryDto } from '@lib/user-reward-history/dto/create-user-reward-history.dto'
import { plainToInstance } from 'class-transformer'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { STATUS } from './enum'

@Injectable()
export class UserRewardHistoryService {
  constructor(
    @InjectRepository(UserRewardHistory)
    private userRewardHistoryRepository: Repository<UserRewardHistory>,
  ) {}

  async save(userRewardHistoryDto: CreateUserRewardHistoryDto) {
    const createUserRewardHistory = plainToInstance(
      CreateUserRewardHistoryDto,
      userRewardHistoryDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )

    const userRewardHistoryEntity = plainToInstance(
      UserRewardHistory,
      createUserRewardHistory,
      {
        ignoreDecorators: true,
      },
    )
    return await this.userRewardHistoryRepository.save(userRewardHistoryEntity)
  }

  async updateStatus(id: number, status: STATUS) {
    return await this.userRewardHistoryRepository.update({ id }, { status })
  }
}
