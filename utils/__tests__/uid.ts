import { describe, expect, test } from '@jest/globals'

import { toBase64 } from '~utils/uid'

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
