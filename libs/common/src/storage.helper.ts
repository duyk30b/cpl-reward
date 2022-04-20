import {
  appendFile,
  existsSync,
  mkdirSync,
  readFile,
  unlink,
  writeFile,
} from 'fs'
import { promisify } from 'util'
import * as path from 'path'

/**
 * Check if a file exists at a given path.
 *
 * @param {string} path
 *
 * @returns {boolean}
 */
export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  try {
    return existsSync(path)
  } catch (error) {
    return false
  }
}

/**
 * Gets file data from a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} encoding
 *
 * @returns {Promise<Buffer>}
 */
export const getFile = async (path: string): Promise<string | Buffer> => {
  const readFileTemp = promisify(readFile)
  return readFileTemp(path, {})
}

/**
 * Writes a file at a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} fileName
 * @param {string} data
 *
 * @return {Promise<void>}
 */
export const WriteAppendData = async (
  pathCreate: string,
  fileName: string,
  data: string,
): Promise<void> => {
  try {
    if (!checkIfFileOrDirectoryExists(pathCreate)) {
      await mkDirByPathSync(pathCreate)
    }

    const appendFileTemp = promisify(appendFile)
    return await appendFileTemp(`${pathCreate}/${fileName}`, data)
  } catch (error) {
    return null
  }
}

export const WriteData = async (
  pathCreate: string,
  fileName: string,
  data: string,
): Promise<void> => {
  try {
    if (!checkIfFileOrDirectoryExists(pathCreate)) {
      mkDirByPathSync(pathCreate)
    }

    const writeFileTemp = promisify(writeFile)
    return await writeFileTemp(`${pathCreate}/${fileName}`, data)
  } catch (error) {
    // console.log(error)
    return null
  }
}

/**
 * Delete file at the given path via a promise interface
 *
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
export const deleteFile = async (path: string): Promise<void> => {
  const unlinkTemp = promisify(unlink)

  return await unlinkTemp(path)
}

const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      mkdirSync(curDir)
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`)
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err // Throw if it's just the last created dir.
      }
    }

    return curDir
  }, initDir)
}
