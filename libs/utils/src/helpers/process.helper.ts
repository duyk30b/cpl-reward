import { INestApplicationContext } from '@nestjs/common'
import { NestContainer } from '@nestjs/core'
import * as fs from 'fs'

export function getAllControllers(app: INestApplicationContext) {
  const container = (app as any).container as NestContainer
  const modules = container.getModules()
  const result = []
  modules.forEach((module) => {
    const controllers = module.controllers
    controllers.forEach((controller, type) => {
      result.push(type)
    })
  })
  return result
}

export function touchFile(filePath: string) {
  const time = new Date()
  try {
    fs.utimesSync(filePath, time, time)
  } catch (e) {
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
}
