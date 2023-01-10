import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedMetaLoadMoreDto } from '../dto/paginated.dto'
import { applyDecorators, Type } from '@nestjs/common'

export const ApiLoadMoreResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedMetaLoadMoreDto) },
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
