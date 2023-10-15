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
            {
              pattern: 'a',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">a</span> b c</p>'
      )
    })

    test('in text', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            {
              pattern: 'b',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<p>a <span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">b</span> c</p>'
      )
    })

    test('before <', () => {
      const input = '<p>a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            {
              pattern: 'c',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<p>a b <span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">c</span></p>'
      )
    })

    test('prevent replace tag', () => {
      const input = '<b>a b c</b>'
      expect(
        highlight({
          html: input,
          rules: [
            {
              pattern: 'b',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<b>a <span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">b</span> c</b>'
      )
    })
    test('prevent replace attribute', () => {
      const input = '<p b="b">a b c</p>'
      expect(
        highlight({
          html: input,
          rules: [
            {
              pattern: 'b',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<p b="b">a <span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">b</span> c</p>'
      )
    })
    test('case insensitive', () => {
      const input = '<p>welcome Welcome</p>'
      expect(
        highlight({
          html: input,
          rules: [
            {
              pattern: 'Welcome',
              backgroundColor: '#112233',
              fontColor: '#0000FF',
              note: 't'
            }
          ]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">welcome</span> <span class="_highlighto" style="background-color: #112233; color: #0000FF" title="t">Welcome</span></p>'
      )
    })
  })
  test('multiple patterns', () => {
    const input = '<p>a b c</p>'
    expect(
      highlight({
        html: input,
        rules: [
          {
            pattern: 'a',
            backgroundColor: '#112233',
            fontColor: '#1122FF',
            note: 't'
          },
          {
            pattern: 'b',
            backgroundColor: '#445566',
            fontColor: '#4455FF',
            note: 't2'
          }
        ]
      })
    ).toEqual(
      '<p><span class="_highlighto" style="background-color: #112233; color: #1122FF" title="t">a</span> <span class="_highlighto" style="background-color: #445566; color: #4455FF" title="t2">b</span> c</p>'
    )
  })

  describe('failed scenario', () => {
    test('case 1', () => {
      const html = '<p><a href="#options">options</a><p>'
      const result = highlight({
        html,
        rules: [
          {
            pattern: 'options',
            backgroundColor: '#FF0000',
            fontColor: '#0000FF',
            note: 't'
          }
        ]
      })
      // was
      // <p><a href=\"#<span class=\"_highlighto\" style=\"background-color: #FF0000; color: #0000FF\">options</span>\"><span class=\"_highlighto\" style=\"background-color: #FF0000; color: #0000FF\">options</span></a><p>
      expect(result).toEqual(
        '<p><a href="#options"><span class="_highlighto" style="background-color: #FF0000; color: #0000FF" title="t">options</span></a><p>'
      )
    })
  })
})
