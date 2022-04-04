import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EventCommon } from './event-common.schema'

export type EventAuthDocument = EventAuth & Document

@Schema({ collection: 'event_auth' })
export class EventAuth extends EventCommon {}

export const EventAuthSchema = SchemaFactory.createForClass(EventAuth)
