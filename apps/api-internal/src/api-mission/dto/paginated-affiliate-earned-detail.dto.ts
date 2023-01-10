import { ApiProperty } from '@nestjs/swagger'

export class PaginatedAffiliateEarnedDetailDto {
  @ApiProperty({ example: 2 })
  id: number

  @ApiProperty({ example: 67, name: 'campaign_id' })
  campaignId: number

  @ApiProperty({ example: 440, name: 'mission_id' })
  missionId: number

  @ApiProperty({ example: '41333', name: 'user_id' })
  userId: string

  @ApiProperty({ example: 'referral_user', name: 'user_type' })
  userType: string

  @ApiProperty({ example: '2.500000000000000000' })
  amount: string

  @ApiProperty({ example: 'BCAST' })
  currency: string

  @ApiProperty({ example: 1 })
  wallet: number

  @ApiProperty({ example: 2, name: 'delivery_method' })
  deliveryMethod: number

  @ApiProperty({ example: 2 })
  status: number

  @ApiProperty({ example: '41332', name: 'referrer_user_id' })
  referrerUserId: string

  @ApiProperty({ example: '309166488055719846', name: 'reference_id' })
  referenceId: string

  @ApiProperty({ example: 1651547834, name: 'created_at' })
  createdAT: number

  @ApiProperty({ example: 1651547834, name: 'updated_at' })
  updatedAt: number
}
