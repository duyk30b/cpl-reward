import { Expose } from 'class-transformer'

export class CreateMissionEventDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'event_name' })
  eventName: string
}
