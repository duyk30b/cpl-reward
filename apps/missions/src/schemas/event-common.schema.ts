import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type EventCommonDocument = EventCommon & Document

@Schema()
export class EventCommon {
  @Prop()
  user_id: string

  @Prop()
  topic: string

  @Prop()
  type: string

  @Prop()
  message_id: string

  @Prop()
  mission_id: string

  @Prop({ type: Object })
  data: any

  @Prop()
  status: boolean

  @Prop({ name: 'created_at', default: Date.now() })
  created_at: Date
}

export const EventCommonSchema = SchemaFactory.createForClass(EventCommon)
