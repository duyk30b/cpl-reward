import { ValueTransformer } from 'typeorm'

export const JsonColumnTransformer: ValueTransformer = {
  to: (value) => JSON.stringify(value || []),
  // from: (value) => JSON.parse(value || '[]'),
  from: (value) => value,
}

export const BooleanColumnTransformer: ValueTransformer = {
  to: (value) => value === 1,
  from: (value) => (value ? 1 : 0),
}
