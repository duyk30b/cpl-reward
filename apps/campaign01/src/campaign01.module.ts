import { Module } from '@nestjs/common'
import { Campaign01Controller } from './campaign01.controller'
import { Campaign01Service } from './campaign01.service'

@Module({
  imports: [],
  controllers: [Campaign01Controller],
  providers: [Campaign01Service],
})
export class Campaign01Module {}
