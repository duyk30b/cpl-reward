import { Module } from '@nestjs/common'
import { C01VerifyService } from './c01-verify.service'

@Module({
  providers: [C01VerifyService],
})
export class C01VerifyModule {}
