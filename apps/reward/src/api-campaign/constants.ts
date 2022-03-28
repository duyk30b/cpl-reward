export const GetCampaignByIdResponse = {
  schema: {
    properties: {
      id: {
        type: 'number',
        example: 100,
      },
      title: {
        type: 'string',
        example: 'campaign title',
      },
      description: {
        type: 'string',
        example: 'campaign description',
      },
      detail_explain: {
        type: 'string',
        example: 'campaign detail_explain',
      },
      start_date: {
        type: 'number',
        example: 1648005669,
      },
      end_date: {
        type: 'number',
        example: 1679541669,
      },
      notification_link: {
        type: 'string',
        example: 'https://...',
      },
      campaign_image: {
        type: 'string',
        example: 'https://...',
      },
    },
  },
}
