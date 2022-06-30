export const ERROR_CODE = {
  FAILED_TO_CLAIM: 'REWARD.UNCLAIMABLE',
}

export const AffiliateEarnedShortResponse = {
  schema: {
    properties: {
      history_currency: {
        type: 'string',
        example: 'BCAST',
      },
      history_wallet: {
        type: 'number',
        example: 1,
        description: 'BALANCE = 1, CASHBACK = 2, DIVIDEND = 3',
      },
      total_amount: {
        type: 'string',
        example: '1.200000000000000000',
      },
    },
  },
}

export const NotFoundResponse = {
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 404,
      },
      msg: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
        example: '2022-05-05T03:49:34.636Z',
      },
      path: {
        type: 'string',
      },
    },
  },
}

export const UnauthorizedResponse = {
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 401,
      },
      msg: {
        type: 'string',
        example: 'UNAUTHORIZED',
      },
      timestamp: {
        type: 'string',
        example: '2022-05-05T03:49:34.636Z',
      },
      path: {
        type: 'string',
      },
    },
  },
}

export const GetCampaignByIdResponse = {
  schema: {
    properties: {
      id: {
        type: 'number',
        example: 100,
      },
      title: {
        type: 'string',
        example: 'string',
      },
      title_ja: {
        type: 'string',
        example: 'string',
      },
      description: {
        type: 'string',
        example: 'string',
      },
      description_ja: {
        type: 'string',
        example: 'string',
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
        example: 'string',
      },
      notification_link_ja: {
        type: 'string',
        example: 'string',
      },
      campaign_image: {
        type: 'string',
        example: 'string',
      },
      campaign_image_ja: {
        type: 'string',
        example: 'string',
      },
      priority: {
        type: 'number',
        example: 2,
      },
      status: {
        type: 'number',
        example: 1,
      },
    },
  },
}

export const GetCheckinCampaignResponse = {
  schema: {
    properties: {
      campaign: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 100,
          },
          title: {
            type: 'string',
            example: 'string',
          },
          title_ja: {
            type: 'string',
            example: 'string',
          },
          description: {
            type: 'string',
            example: 'string',
          },
          description_ja: {
            type: 'string',
            example: 'string',
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
            example: 'string',
          },
          notification_link_ja: {
            type: 'string',
            example: 'string',
          },
          campaign_image: {
            type: 'string',
            example: 'string',
          },
          campaign_image_ja: {
            type: 'string',
            example: 'string',
          },
          priority: {
            type: 'number',
            example: 2,
          },
          status: {
            type: 'number',
            example: 1,
          },
          reset_time: {
            type: 'number',
            example: 1679541669,
          },
          should_show_popup: {
            type: 'boolean',
            example: true,
          },
        },
      },
      missions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 100,
            },
            campaign_id: {
              type: 'number',
              example: 28,
            },
            title: {
              type: 'string',
              example: 'string',
            },
            title_ja: {
              type: 'string',
              example: 'string',
            },
            detail_explain: {
              type: 'string',
              example: 'string',
            },
            detail_explain_ja: {
              type: 'string',
              example: 'string',
            },
            opening_date: {
              type: 'number',
              example: 1648005669,
            },
            closing_date: {
              type: 'number',
              example: 1679541669,
            },
            guide_link: {
              type: 'string',
              example: 'string',
            },
            guide_link_ja: {
              type: 'string',
              example: 'string',
            },
            status: {
              type: 'number',
              example: '1',
            },
            currency: {
              type: 'string',
              example: 'USDT',
            },
            amount: {
              type: 'string',
              example: '12',
            },
            wallet: {
              type: 'number',
              example: '1',
            },
            claim_status: {
              type: 'number',
              example: '1',
            },
          },
        },
      },
    },
  },
}

export const FailedToCheckinResponse = {
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 400,
      },
      msg: {
        type: 'string',
        example: ERROR_CODE.FAILED_TO_CLAIM,
      },
      timestamp: {
        type: 'string',
        example: '2022-05-05T03:49:34.636Z',
      },
      path: {
        type: 'string',
      },
    },
  },
}

export const PostCheckinCampaignResponse = {
  schema: {
    properties: {
      mission: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 100,
          },
          campaign_id: {
            type: 'number',
            example: 28,
          },
          title: {
            type: 'string',
            example: 'string',
          },
          title_ja: {
            type: 'string',
            example: 'string',
          },
          detail_explain: {
            type: 'string',
            example: 'string',
          },
          detail_explain_ja: {
            type: 'string',
            example: 'string',
          },
          opening_date: {
            type: 'number',
            example: 1648005669,
          },
          closing_date: {
            type: 'number',
            example: 1679541669,
          },
          guide_link: {
            type: 'string',
            example: 'string',
          },
          guide_link_ja: {
            type: 'string',
            example: 'string',
          },
          status: {
            type: 'number',
            example: '1',
          },
          currency: {
            type: 'string',
            example: 'USDT',
          },
          amount: {
            type: 'string',
            example: '12',
          },
          wallet: {
            type: 'number',
            example: '1',
          },
          claim_status: {
            type: 'number',
            example: '1',
          },
        },
      },
    },
  },
}

export const IgnoreCheckinCampaignResponse = {
  schema: {
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
    },
  },
}

export const RedeemMissionResponse = {
  schema: {
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
    },
  },
}
