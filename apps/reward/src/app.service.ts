import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  waitforme() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 100)
    })
  }
}
