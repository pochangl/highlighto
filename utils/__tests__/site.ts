import { describe, expect, test } from '@jest/globals'

import { findSite, ISite } from '~utils/site'

describe('findSites', () => {
  test('exact', () => {
    const site = {
      uri_pattern: 'http://example.com',
      rules: []
    }
    const sites: ISite[] = [site]
    const found = findSite('http://example.com', sites)
    expect(found).toBe(site)
  })
  test('not found', () => {
    const site = {
      uri_pattern: 'http://example.com1',
      rules: []
    }
    const sites: ISite[] = [site]
    const found = findSite('http://example.com', sites)
    expect(found).toBeNull()
  })
  test('prefix', () => {
    const site: ISite = {
      uri_pattern: 'http://example.com',
      rules: []
    }
    const sites: ISite[] = [site]
    const found = findSite('http://example.com/path', sites)
    expect(found).toBe(site)
  })
  test('regex', () => {
    const site: ISite = {
      uri_pattern: '^http://example.com/[0-9]{2}/$',
      rules: []
    }
    const found = findSite('http://example.com/12/', [site])
    expect(found).toBe(site)
    const not_found = findSite('http://example.com/1a/', [site])
    expect(not_found).toBeNull()
  })
})
