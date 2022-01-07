import { applyDecorators } from '@nestjs/common'
import { Transform, TransformOptions } from 'class-transformer'

export function TransformTrim(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      if (!params.value || typeof params.value !== 'string') return params.value
      return params.value.trim()
    }, options),
  )
}

export function TransformBoolean(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      return params.value == 1 ? true : false
    }, options),
  )
}

export function TransformInt(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      return params.value ? parseInt(params.value) : params.value
    }, options),
  )
}
