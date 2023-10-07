import { describe, expect, test } from '@jest/globals';



import { findSite, ISite } from '~utils/site';





describe('findSites', () => {
  test('exact', () => {
    const site = {
      uri_pattern: 'http://example.com',
      rules: []
    }
    const found = findSite('http://example.com', {[site.uri_pattern]: site})
    expect(found).toBe(site)
  })
  test('not found', () => {
    const site = {
      uri_pattern: 'http://example.com1',
      rules: []
    }
    const found = findSite('http://example.com', { [site.uri_pattern]: site })
    expect(found).toBeNull()
  })
  test('prefix', () => {
    const site: ISite = {
      uri_pattern: 'http://example.com',
      rules: []
    }
    const found = findSite('http://example.com/path', {
      [site.uri_pattern]: site
    })
    expect(found).toBe(site)
  })
  test('regex', () => {
    const site: ISite = {
      uri_pattern: '^http://example.com/[0-9]{2}/$',
      rules: []
    }
    const found = findSite('http://example.com/12/', {
      [site.uri_pattern]: site
    })
    expect(found).toBe(site)
    const not_found = findSite('http://example.com/1a/', {
      [site.uri_pattern]: site
    })
    expect(not_found).toBeNull()
  })
  test('multiple sites', () => {
    const site1: ISite = {
      uri_pattern: 'http://example1.com',
      rules: []
    }
    const site2: ISite = {
      uri_pattern: 'http://example2.com',
      rules: []
    }
    const sites = { [site1.uri_pattern]: site1, [site2.uri_pattern]: site2 }
    const found1 = findSite('http://example1.com', sites)
    expect(found1).toBe(site1)
    const found2 = findSite('http://example2.com', sites)
    expect(found2).toBe(site2)
  })
})