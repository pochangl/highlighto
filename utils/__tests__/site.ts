import { describe, expect, test } from '@jest/globals'

import { findSite, overwriteSite } from '~utils/site'

describe('findSites', () => {
  test('exact', () => {
    const site = {
      id: 1,
      uri_pattern: 'http://example.com',
      rules: []
    }
    const found = findSite('http://example.com', { [site.uri_pattern]: site })
    expect(found).toBe(site)
  })
  test('not found', () => {
    const site = {
      id: 1,
      uri_pattern: 'http://example.com1',
      rules: []
    }
    const found = findSite('http://example.com', { [site.uri_pattern]: site })
    expect(found).toBeNull()
  })
  test('prefix', () => {
    const site = {
      id: 1,
      uri_pattern: 'http://example.com',
      rules: []
    }
    const found = findSite('http://example.com/path', {
      [site.uri_pattern]: site
    })
    expect(found).toBe(site)
  })
  test('regex', () => {
    const site = {
      id: 1,
      uri_pattern: '^http://example.com/[0-9]{2}/$',
      rules: []
    }
    const found = findSite('http://example.com/12/', {
      [site.uri_pattern]: site
    })
    expect(found).toBe(site)
    const notFound = findSite('http://example.com/1a/', {
      [site.uri_pattern]: site
    })
    expect(notFound).toBeNull()
  })
  test('multiple sites', () => {
    const site1 = {
      id: 1,
      uri_pattern: 'http://example1.com',
      rules: []
    }
    const site2 = {
      id: 2,
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

describe('overwriteSite function', () => {
  describe('rewrite existed record', () => {
    test('test rewrite', () => {
      // test rewrite rules
      const newSite = {
        id: 1,
        uri_pattern: 'http://example.com',
        rules: [{ pattern: 'a', backgroundColor: '1', fontColor: '0000FF' }]
      }
      const sites = {
        'http://example.com': {
          id: 1,
          uri_pattern: 'http://example.com',
          rules: []
        }
      }
      overwriteSite(newSite, sites)
      expect(sites).toEqual({
        'http://example.com': {
          id: 1,
          uri_pattern: 'http://example.com',
          rules: [{ pattern: 'a', backgroundColor: '1', fontColor: '0000FF' }]
        }
      })
    })
    test('single record 1', () => {
      // simple case with only one record in sites
      const newSite = {
        id: 1,
        uri_pattern: 'http://example2.com',
        rules: []
      }
      const sites = {
        'http://example1.com': {
          id: 1,
          uri_pattern: 'http://example1.com',
          rules: []
        }
      }
      overwriteSite(newSite, sites)
      expect(sites).toEqual({
        'http://example2.com': {
          id: 1,
          uri_pattern: 'http://example2.com',
          rules: []
        }
      })
    })
    test('single record 2', () => {
      // simple case with multiple record in sites
      const site = {
        id: 1,
        uri_pattern: 'http://example1.com',
        rules: []
      }
      const newSite = {
        id: 1,
        uri_pattern: 'http://example2.com',
        rules: []
      }
      const sites = {
        'http://example1.com': {
          id: 1,
          uri_pattern: 'http://example1.com',
          rules: []
        },
        'http://example2.com': {
          id: 2,
          uri_pattern: 'http://example2.com',
          rules: []
        }
      }
      overwriteSite(
        {
          id: 1,
          uri_pattern: 'http://example3.com',
          rules: []
        },
        sites
      )
      overwriteSite(
        {
          id: 2,
          uri_pattern: 'http://example4.com',
          rules: []
        },
        sites
      )
      expect(sites).toEqual({
        'http://example3.com': {
          id: 1,
          uri_pattern: 'http://example3.com',
          rules: []
        },
        'http://example4.com': {
          id: 2,
          uri_pattern: 'http://example4.com',
          rules: []
        }
      })
    })
    test('test pattern collision', () => {
      const newSite = {
        id: 1,
        uri_pattern: 'http://example1.com',
        rules: []
      }
      const sites = {
        'http://example1.com': {
          id: 2,
          uri_pattern: 'http://example1.com',
          rules: []
        }
      }
      expect(() => {
        overwriteSite(newSite, sites)
      }).toThrow('pattern already defined')
    })
  })
  test('test add', () => {
    // test rewrite rules
    const newSite = {
      uri_pattern: 'http://example.com',
      rules: [{ pattern: 'a', backgroundColor: '1', fontColor: '0000FF' }]
    }
    const sites = {}
    overwriteSite(newSite, sites)
    expect(sites).toEqual({
      'http://example.com': {
        id: 1,
        uri_pattern: 'http://example.com',
        rules: [{ pattern: 'a', backgroundColor: '1', fontColor: '0000FF' }]
      }
    })
  })
  test('test add pattern collision', () => {
    const newSite = {
      uri_pattern: 'http://example1.com',
      rules: []
    }
    const sites = {
      'http://example1.com': {
        id: 1,
        uri_pattern: 'http://example1.com',
        rules: []
      }
    }
    expect(() => {
      overwriteSite(newSite, sites)
    }).toThrow('pattern already defined')
  })
})
