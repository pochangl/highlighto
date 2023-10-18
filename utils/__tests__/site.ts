import { describe, expect, test } from '@jest/globals'

import {
  buildGroup,
  buildRule,
  buildSite,
  findSite,
  getRules,
  overwriteRule,
  overwriteSite,
  removeRule
} from '~utils/site'

describe('findSites', () => {
  test('exact', () => {
    const site = buildSite({
      id: '1',
      uri_pattern: 'http://example.com'
    })
    const found = findSite('http://example.com', { [site.uri_pattern]: site })
    expect(found).toBe(site)
  })
  test('not found', () => {
    const site = buildSite({
      id: '1',
      uri_pattern: 'http://example.com1'
    })
    const found = findSite('http://example.com', { [site.uri_pattern]: site })
    expect(found).toBeNull()
  })
  test('prefix', () => {
    const site = buildSite({
      id: '1',
      uri_pattern: 'http://example.com'
    })
    const found = findSite('http://example.com/path', {
      [site.uri_pattern]: site
    })
    expect(found).toBe(site)
  })
  test('regex', () => {
    const site = buildSite({
      id: '1',
      uri_pattern: '^http://example.com/[0-9]{2}/$'
    })
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
    const site1 = buildSite({
      id: '1',
      uri_pattern: 'http://example1.com'
    })
    const site2 = buildSite({
      id: '2',
      uri_pattern: 'http://example2.com'
    })
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
      const newSite = buildSite({
        id: '1',
        uri_pattern: 'http://example.com',
        rules: [
          buildRule({
            id: '1',
            pattern: 'a',
            backgroundColor: '1',
            fontColor: '0000FF'
          })
        ],
        groups: []
      })
      const sites = {
        'http://example.com': buildSite({
          id: '1',
          uri_pattern: 'http://example.com',
          rules: [],
          groups: []
        })
      }
      overwriteSite(newSite, sites)
      expect(sites).toEqual({
        'http://example.com': buildSite({
          id: '1',
          uri_pattern: 'http://example.com',
          rules: [
            buildRule({
              id: '1',
              pattern: 'a',
              backgroundColor: '1',
              fontColor: '0000FF'
            })
          ],
          groups: []
        })
      })
    })
    test('single record 1', () => {
      // simple case with only one record in sites
      const newSite = buildSite({
        id: '1',
        uri_pattern: 'http://example2.com',
        rules: [],
        groups: []
      })
      const sites = {
        'http://example1.com': buildSite({
          id: '1',
          uri_pattern: 'http://example1.com',
          rules: [],
          groups: []
        })
      }
      overwriteSite(newSite, sites)
      expect(sites).toEqual({
        'http://example2.com': buildSite({
          id: '1',
          uri_pattern: 'http://example2.com',
          rules: [],
          groups: []
        })
      })
    })
    test('single record 2', () => {
      // simple case with multiple record in sites
      const sites = {
        'http://example1.com': buildSite({
          id: '1',
          uri_pattern: 'http://example1.com',
          rules: [],
          groups: []
        }),
        'http://example2.com': buildSite({
          id: '2',
          uri_pattern: 'http://example2.com',
          rules: [],
          groups: []
        })
      }
      overwriteSite(
        buildSite({
          id: '1',
          uri_pattern: 'http://example3.com',
          rules: [],
          groups: []
        }),
        sites
      )
      overwriteSite(
        buildSite({
          id: '2',
          uri_pattern: 'http://example4.com',
          rules: [],
          groups: []
        }),
        sites
      )
      expect(sites).toEqual({
        'http://example3.com': buildSite({
          id: '1',
          uri_pattern: 'http://example3.com',
          rules: [],
          groups: []
        }),
        'http://example4.com': buildSite({
          id: '2',
          uri_pattern: 'http://example4.com',
          rules: [],
          groups: []
        })
      })
    })
    test('test pattern collision', () => {
      const newSite = buildSite({
        id: '1',
        uri_pattern: 'http://example1.com'
      })
      const sites = {
        'http://example1.com': buildSite({
          id: '2',
          uri_pattern: 'http://example1.com'
        })
      }
      expect(() => {
        overwriteSite(newSite, sites)
      }).toThrow('pattern already defined')
    })
  })
  test('test add', () => {
    // test rewrite rules
    const newSite = buildSite({
      uri_pattern: 'http://example.com',
      rules: [
        buildRule({
          id: '1',
          pattern: 'a',
          backgroundColor: '1',
          fontColor: '0000FF'
        })
      ]
    })
    const sites = {}
    overwriteSite(newSite, sites)
    expect(sites).toEqual({
      'http://example.com': newSite
    })
  })
  test('test add pattern collision', () => {
    const newSite = buildSite({
      uri_pattern: 'http://example1.com'
    })
    const sites = {
      'http://example1.com': buildSite({
        id: '1',
        uri_pattern: 'http://example1.com'
      })
    }
    expect(() => {
      overwriteSite(newSite, sites)
    }).toThrow('pattern already defined')
  })

  describe('buildRules', () => {
    test('no group', () => {
      const rule = buildRule({
        group: null,
        fontColor: 'white'
      })
      const group = buildGroup({
        id: '1',
        fontColor: 'red'
      })
      const rules = getRules([group], [rule])
      expect(rules).toEqual([rule])
    })
    test('with group', () => {
      const rule = buildRule({
        group: '1',
        fontColor: 'white'
      })
      const group = buildGroup({
        id: '1',
        fontColor: 'red'
      })
      const rules = getRules([group], [rule])

      expect(rules).toEqual([Object.assign({}, rule, { fontColor: 'red' })])
    })
  })
})

describe('overwriteRule function', () => {
  test('test rewrite', () => {
    const oldRule = buildRule({
      id: '1',
      note: 'old'
    })
    const newRule = buildRule({
      id: '1'
    })
    expect(newRule).not.toEqual(oldRule)
    expect(overwriteRule(newRule, [oldRule])).toEqual([newRule])
  })
  test('test rewrite 2', () => {
    // multiple rules
    const oldRule1 = buildRule({
      id: '1',
      note: 'old'
    })
    const oldRule2 = buildRule({
      id: '2',
      note: 'old'
    })
    const newRule1 = buildRule({
      id: '1'
    })
    const newRule2 = buildRule({
      id: '2'
    })
    expect(newRule1).not.toEqual(oldRule2)
    expect(newRule1).not.toEqual(oldRule2)

    expect(overwriteRule(newRule1, [oldRule1, oldRule2])).toEqual([
      oldRule2,
      newRule1
    ])
    expect(overwriteRule(newRule2, [oldRule1, oldRule2])).toEqual([
      oldRule1,
      newRule2
    ])
  })
})

describe('removeRule function', () => {
  test('test remove', () => {
    const oldRule = buildRule({
      id: '1',
      note: 'old'
    })
    const newRule = buildRule({
      id: '1'
    })
    expect(removeRule(newRule, [oldRule])).not.toEqual(oldRule)
  })
  test('test rewrite 2', () => {
    // multiple rules
    const oldRule1 = buildRule({
      id: '1',
      note: 'old'
    })
    const oldRule2 = buildRule({
      id: '2',
      note: 'old'
    })
    const removedRule1 = buildRule({
      id: '1'
    })
    const removedRule2 = buildRule({
      id: '2'
    })
    expect(removeRule(removedRule1, [oldRule1, oldRule2])).toEqual([oldRule2])
    expect(removeRule(removedRule2, [oldRule1, oldRule2])).toEqual([oldRule1])
  })
})
