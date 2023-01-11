import { HttpStatus, ValidationError } from '@nestjs/common'
import { EValidationError } from './error.enum'

export class ValidationException extends Error {
  private readonly errors: ValidationError[]
  constructor(validationErrors: ValidationError[] = []) {
    super(EValidationError.FAIL)
    this.errors = validationErrors
  }
  getMessage() {
    return this.message
  }
  getStatus() {
    return HttpStatus.BAD_REQUEST
  }
  getErrors() {
    return this.errors
  }
}
