import { text } from "stream/consumers";
import { describe, expect, test } from "@jest/globals";



import { highlight } from "~/utils/highlight";





describe("highlight function", () => {
  describe("single pattern", () => {
    test("after >", () => {
      const input = "<p>a b c</p>"
      expect(
        highlight({
          html: input,
          rules: [{ pattern: "a", color: "112233" }]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233">a</span> b c</p>'
      )
    })

    test("in text", () => {
      const input = "<p>a b c</p>"
      expect(
        highlight({
          html: input,
          rules: [{ pattern: "b", color: "112233" }]
        })
      ).toEqual(
        '<p>a <span class="_highlighto" style="background-color: #112233">b</span> c</p>'
      )
    })

    test("before <", () => {
      const input = "<p>a b c</p>"
      expect(
        highlight({
          html: input,
          rules: [{ pattern: "c", color: "112233" }]
        })
      ).toEqual(
        '<p>a b <span class="_highlighto" style="background-color: #112233">c</span></p>'
      )
    })
  })
  test("multiple patterns", () => {
    const input = "<p>a b c</p>"
      expect(
        highlight({
          html: input,
          rules: [
            { pattern: "a", color: "112233" },
            { pattern: "b", color: "445566" }
          ]
        })
      ).toEqual(
        '<p><span class="_highlighto" style="background-color: #112233">a</span> <span class="_highlighto" style="background-color: #445566">b</span> c</p>'
      )
  })
})