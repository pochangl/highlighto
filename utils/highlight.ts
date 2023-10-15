import { escapeHtml } from './html'

export interface IColorSetting {
  backgroundColor: string
  fontColor: string
}

export interface IRule extends IColorSetting {
  pattern: string
  note: string // side note on highlighted item
}

export function highlight(options: { html: string; rules: IRule[] }) {
  let html = options.html
  const regex = new RegExp(
    options.rules.map((rule) => rule.pattern).join('|'),
    'gi'
  )
  const map = Object.fromEntries(
    new Map(
      options.rules.map((rule) => [
        rule.pattern.toLowerCase(),
        {
          background: rule.backgroundColor,
          color: rule.fontColor,
          title: rule.note
        }
      ])
    )
  )
  html = html.replace(/>(?<text>[^<>]+)</gi, function (...args1) {
    // replace text part of html
    let text = args1.at(-1).text
    // replace keywords
    text = text.replace(regex, function (matched) {
      const rule = map[matched.toLowerCase()]
      return `<span class="_highlighto" style="background-color: ${escapeHtml(
        rule.background
      )}; color: ${escapeHtml(rule.color)}" title="${escapeHtml(rule.title)}">${escape(matched)}</span>`
    })
    return `>${text}<`
  })
  return html
}
