export function currentUnixTime(format = 'second'): number {
  if (format == 'millisecond') {
    return new Date().getTime()
  }

  return Math.floor(new Date().getTime() / 1000)
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min // Returns a random integer from min to max
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
