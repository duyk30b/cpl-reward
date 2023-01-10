import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedMetaAffiliateDto } from '../dto/paginated.dto'
import { applyDecorators, Type } from '@nestjs/common'

export const ApiAffiliateResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedMetaAffiliateDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  )
}
