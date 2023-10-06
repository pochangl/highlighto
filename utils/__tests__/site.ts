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
})
