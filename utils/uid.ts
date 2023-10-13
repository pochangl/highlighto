let version = 0n
const BASE64_LETTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

export function toBase64(num: bigint): string {
  const remainders: number[] = []
  let remainder: bigint
  do {
    remainder = num % 64n
    remainders.push(Number(remainder))
    num = num / 64n
  } while (num >= 1)
  remainders.reverse()
  return remainders.map((index) => BASE64_LETTERS.at(index)).join('')
}

export function getUid(): bigint {
  const buckets = 100000n

  version = version + 1n
  const timestamp = BigInt(new Date().getTime())
  const uid = timestamp * buckets + (version % buckets)
  return uid
}

export function getUid64(): string {
  // a method to get unique uid in single thread environment
  return toBase64(getUid())
}
