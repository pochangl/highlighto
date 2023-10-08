import { describe, expect, test } from '@jest/globals'

import { highlight } from '~/utils/highlight'

describe('highlight function', () => {
  describe('single pattern', () => {
    test('after >', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: 'a', backgroundColor: '#112233', fontColor: '#0000FF' }
          ]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233; color: #0000FF">a</span> b c</p>'
      )
    })

    test('in text', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: 'b', backgroundColor: '#112233', fontColor: '#0000FF' }
          ]
        })
      ).toEqual(
        '<p>a <span class="_highlighto" style="background-color: #112233; color: #0000FF">b</span> c</p>'
      )
    })

    test('before <', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: 'c', backgroundColor: '#112233', fontColor: '#0000FF' }
          ]
        })
      ).toEqual(
        '<p>a b <span class="_highlighto" style="background-color: #112233; color: #0000FF">c</span></p>'
      )
    })

    test('prevent replace tag', () => {
      const input = '<b>a b c</b>'
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: 'b', backgroundColor: '#112233', fontColor: '#0000FF' }
          ]
        })
      ).toEqual(
        '<b>a <span class="_highlighto" style="background-color: #112233; color: #0000FF">b</span> c</b>'
      )
    })
    test('prevent replace attribute', () => {
      const input = '<p b="b">a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: 'b', backgroundColor: '#112233', fontColor: '#0000FF' }
          ]
        })
      ).toEqual(
        '<p b="b">a <span class="_highlighto" style="background-color: #112233; color: #0000FF">b</span> c</p>'
      )
    })
  })
  test('multiple patterns', () => {
    const input = '<p>a b c</p>'
    expect(
      highlight({
        html: input,
        rules: [
          { pattern: 'a', backgroundColor: '#112233', fontColor: '#1122FF' },
          { pattern: 'b', backgroundColor: '#445566', fontColor: '#4455FF' }
        ]
      })
    ).toEqual(
      '<p><span class="_highlighto" style="background-color: #112233; color: #1122FF">a</span> <span class="_highlighto" style="background-color: #445566; color: #4455FF">b</span> c</p>'
    )
  })

  describe('failed scenario', () => {
    test('case 1', () => {
      const html = '<p><a href="#options">options</a><p>'
      const result = highlight({
        html,
        rules: [
          { pattern: 'options', backgroundColor: '#FF0000', fontColor: '#0000FF' }
        ]
      })
      // was
      // <p><a href=\"#<span class=\"_highlighto\" style=\"background-color: #FF0000; color: #0000FF\">options</span>\"><span class=\"_highlighto\" style=\"background-color: #FF0000; color: #0000FF\">options</span></a><p>
      expect(result).toEqual(
        '<p><a href="#options"><span class="_highlighto" style="background-color: #FF0000; color: #0000FF">options</span></a><p>'
      )
    })
  })
})
