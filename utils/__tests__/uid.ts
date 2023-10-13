import { describe, expect, test } from '@jest/globals'

import { getUid, toBase64 } from '~utils/uid'

describe('toBase64', () => {
  test('0', () => {
    expect(toBase64(0)).toEqual('A')
  })
  test('1', () => {
    expect(toBase64(1)).toEqual('B')
  })
  test('63', () => {
    expect(toBase64(63)).toEqual('_')
  })
  test('64', () => {
    expect(toBase64(64)).toEqual('BA')
  })
  test('65', () => {
    expect(toBase64(65)).toEqual('BB')
  })
  test('1697198134084000', () => {
    expect(toBase64(1697198134084000)).toEqual('GB5e75UGg')
  })
})

describe('getUid', () => {
  test('version increment', () => {
    const version1 = getUid() % 100
    const version2 = getUid() % 100
    expect(version2).toEqual(version1 + 1)
  })
  test('precision', () => {
    // if integer is too big, like (new Date().getTime() * 10000, it loses its precision
    let prev: number
    let current = getUid() % 100
    do {
      prev = current
      current = getUid() % 100
      expect(prev).toEqual((current + 99) % 100)
    } while (current != 0)
  })
})
