import { describe, expect, test } from '@jest/globals'

import { highlight } from '~/utils/highlight'

describe('highlight function', () => {
  describe('single pattern', () => {
    test('after >', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [{ pattern: 'a', backgroundColor: '112233' }]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233">a</span> b c</p>'
      )
    })

    test('in text', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [{ pattern: 'b', backgroundColor: '112233' }]
        })
      ).toEqual(
        '<p>a <span class="_highlighto" style="background-color: #112233">b</span> c</p>'
      )
    })

    test('before <', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [{ pattern: 'c', backgroundColor: '112233' }]
        })
      ).toEqual(
        '<p>a b <span class="_highlighto" style="background-color: #112233">c</span></p>'
      )
    })

    test('prevent replace tag', () => {
      const input = '<b>a b c</b>'
      expect(
        highlight({
          html: input,
          rules: [{ pattern: 'b', backgroundColor: '112233' }]
        })
      ).toEqual(
        '<b>a <span class="_highlighto" style="background-color: #112233">b</span> c</b>'
      )
    })
    test('prevent replace attribute', () => {
      const input = '<p b="b">a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [{ pattern: 'b', backgroundColor: '112233' }]
        })
      ).toEqual(
        '<p b="b">a <span class="_highlighto" style="background-color: #112233">b</span> c</p>'
      )
    })
  })
  test('multiple patterns', () => {
    const input = '<p>a b c</p>'
    expect(
      highlight({
        html: input,
        rules: [
          { pattern: 'a', backgroundColor: '112233' },
          { pattern: 'b', backgroundColor: '445566' }
        ]
      })
    ).toEqual(
      '<p><span class="_highlighto" style="background-color: #112233">a</span> <span class="_highlighto" style="background-color: #445566">b</span> c</p>'
    )
  })

  describe('failed scenario', () => {
    test('case 1', () => {
      const html = '<p><a href="#options">options</a><p>'
      const result = highlight({
        html,
        rules: [{ pattern: 'options', backgroundColor: 'FF0000' }]
      })
      // was
      // <p><a href=\"#<span class=\"_highlighto\" style=\"background-color: #FF0000\">options</span>\"><span class=\"_highlighto\" style=\"background-color: #FF0000\">options</span></a><p>
      expect(result).toEqual(
        '<p><a href="#options"><span class="_highlighto" style="background-color: #FF0000">options</span></a><p>'
      )
    })
  })
})
