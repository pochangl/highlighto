import { describe, expect, test } from '@jest/globals'

import { getUid, getUid64, toBase64 } from '~utils/uid'

describe('toBase64', () => {
  test('0', () => {
    expect(toBase64(0n)).toEqual('A')
  })
  test('1', () => {
    expect(toBase64(1n)).toEqual('B')
  })
  test('63', () => {
    expect(toBase64(63n)).toEqual('_')
  })
  test('64', () => {
    expect(toBase64(64n)).toEqual('BA')
  })
  test('65', () => {
    expect(toBase64(65n)).toEqual('BB')
  })
  test('1697198134084000', () => {
    expect(toBase64(1697198134084000n)).toEqual('GB5e75UGg')
  })
})

describe('getUid', () => {
  test('version increment', () => {
    const version1 = getUid() % 10000n
    const version2 = getUid() % 10000n
    expect(version2).toEqual(version1 + 1n)
  })
  test('precision', () => {
    // if integer is too big, like (new Date().getTime() * 10000, it loses its precision
    let prev: bigint
    let current = getUid() % 1000n
    do {
      prev = current
      current = getUid() % 1000n
      expect(prev).toEqual((current + 999n) % 1000n)
    } while (current != 0n)
  })
  test('collision', () => {
    let length = 1000000
    const uids = new Array(length).fill(0).map(getUid)
    const set = new Set(uids)
    expect(uids.length).toEqual(length)

    expect(Array.from(set).length).toEqual(length)
  })
  test('makes sure milliseconds ticks at least twice for every 100000 uid', () => {
    let buckets = 100000
    const uids = new Array(buckets * 10).fill(0).map(getUid)
    const diff = Number(uids[uids.length - 1] - uids[0])
    expect(diff).toBeGreaterThan(buckets * 30)
  })

  describe('getUid', () => {
    test('uid length', () => {
      expect(getUid64().length).toEqual(10)
    })
  })
})
