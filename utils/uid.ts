let version = 0
const BASE64_LETTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

export function toBase64(num: number): string {
  const remainders: number[] = []
  let remainder: number
  do {
    remainder = num % 64
    remainders.push(remainder)
    num = Math.floor(num / 64)
  } while (num >= 1)
  remainders.reverse()
  return remainders.map((index) => BASE64_LETTERS.at(index)).join('')
}

export function getUid(): number {
  version = version + 1
  const timestamp = new Date().getTime()
  const uid = timestamp * 100 + version
  return uid
}

export function getUid64(): string {
  return toBase64(getUid())
}
