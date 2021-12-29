import { Module } from '@nestjs/common';
import { Campaigns/camp01Controller } from './campaigns/camp01.controller';
import { Campaigns/camp01Service } from './campaigns/camp01.service';

@Module({
  imports: [],
  controllers: [Campaigns/camp01Controller],
  providers: [Campaigns/camp01Service],
})
export class Campaigns/camp01Module {}
