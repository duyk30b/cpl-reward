import { Module } from '@nestjs/common'
import { C01GiveService } from './c01-give.service'

@Module({
  providers: [C01GiveService],
})
export class C01GiveModule {}
