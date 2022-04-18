import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InternationalPrice } from './entities/international-price.entity'
import { InternationalPriceService } from './international-price.service'

@Module({
  imports: [TypeOrmModule.forFeature([InternationalPrice], 'bce')],
  providers: [InternationalPriceService],
  exports: [InternationalPriceService],
})
export class InternationalPriceModule {}
