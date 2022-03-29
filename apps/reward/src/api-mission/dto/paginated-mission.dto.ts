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

  @ApiProperty({ example: 2, name: 'limit_received_reward' })
  limitReceivedReward: string

  @ApiProperty({ example: '20.0', name: 'total_reward_amount' })
  totalRewardAmount: string

  @ApiProperty({ example: '10.0', name: 'received_amount' })
  receivedAmount: string

  @ApiProperty({
    example: '0.0',
    name: 'not_received_amount',
  })
  notReceivedAmount: string

  @ApiProperty({ example: 'USDT' })
  currency: string

  // TODO: remove below property
  @ApiProperty({
    example: 1,
    description: `0: NOT_RECEIVE, ` + `1: RECEIVED, `,
  })
  status: number
}
