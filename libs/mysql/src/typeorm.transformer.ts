import { ValueTransformer } from 'typeorm'

export const JsonColumnTransformer: ValueTransformer = {
  to: (value) => JSON.stringify(value || {}),
  from: (value) => JSON.parse(value || '{}'),
}

export const BooleanColumnTransformer: ValueTransformer = {
  to: (value) => (value === 1 ? true : false),
  from: (value) => (value ? 1 : 0),
}
