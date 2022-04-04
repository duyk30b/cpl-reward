import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EventCommon } from './event-common.schema'

export type EventHighLowDocument = EventHighLow & Document

@Schema({ collection: 'event_high_low' })
export class EventHighLow extends EventCommon {}

export const EventHighLowSchema = SchemaFactory.createForClass(EventHighLow)
