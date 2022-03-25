import { ApiProperty } from '@nestjs/swagger'
import { STATUS } from '@lib/user-reward-history'

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

  @ApiProperty({ example: 59, name: 'total_amount' })
  totalAmount: string

  @ApiProperty({ example: 'USDT' })
  currency: string

  @ApiProperty({
    example: 2,
    description:
      `${STATUS.AUTO_NOT_RECEIVE}: AUTO_NOT_RECEIVE, ` +
      `${STATUS.MANUAL_NOT_RECEIVE}: MANUAL_NOT_RECEIVE, ` +
      `${STATUS.AUTO_RECEIVED}: AUTO_RECEIVED, ` +
      `${STATUS.MANUAL_RECEIVED}: MANUAL_RECEIVED, ` +
      `${STATUS.AUTO_FAIL}: AUTO_FAIL` +
      `${STATUS.MANUAL_FAIL}: MANUAL_FAIL`,
  })
  status: number
}
