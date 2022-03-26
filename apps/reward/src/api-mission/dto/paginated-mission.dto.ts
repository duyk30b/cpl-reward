import { ApiProperty } from '@nestjs/swagger'

export class PaginatedMissionDto {
  @ApiProperty({ example: 2 })
  id: number

  @ApiProperty({ example: 'This is mission title' })
  title: string

  @ApiProperty({
    example: 'This is mission detail explain',
    name: 'detail_explain',
  })
  detailExplain: string

  @ApiProperty({ example: 1648005669, name: 'opening_date' })
  openingDate: string

  @ApiProperty({ example: 1679541669, name: 'closing_date' })
  closingDate: string

  @ApiProperty({ example: 'This is mission guide link', name: 'guide_link' })
  guideLink: string

  @ApiProperty({ example: 23, name: 'limit_received_reward' })
  limitReceivedReward: string

  @ApiProperty({ example: '59.0', name: 'reward_amount' })
  rewardAmount: string

  @ApiProperty({ example: '59.0', name: 'received_amount' })
  receivedAmount: string

  @ApiProperty({ example: 'USDT' })
  currency: string
}
