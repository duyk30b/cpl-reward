import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EventCommon } from './event-common.schema'

export type EventBceDocument = EventBce & Document

@Schema({ collection: 'event_bce' })
export class EventBce extends EventCommon {}

export const EventBceSchema = SchemaFactory.createForClass(EventBce)
