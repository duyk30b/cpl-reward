import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedMetaDto } from '../dto/paginated.dto'
import { applyDecorators, Type } from '@nestjs/common'

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedMetaDto) },
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
