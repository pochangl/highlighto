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
          backgroundColor: rule.backgroundColor,
          fontColor: rule.fontColor,
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

      const styles = [
        ['background-color', 'backgroundColor'],
        ['color', 'fontColor']
      ]
        .map(([attr, field]) => {
          if (rule[field]) {
            return `${attr}: ${escapeHtml(rule[field])}`
          } else {
            return ''
          }
        })
        .join('; ')
      const attributes = [['title', 'title']]
        .map(([attr, field]) => {
          if (rule[field]) {
            return `${attr}="${escapeHtml(rule[field])}"`
          } else {
            return ''
          }
        })
        .join(' ')
      return `<span class="_highlighto" style="${styles}" ${attributes}>${escapeHtml(matched)}</span>`
    })
    return `>${text}<`
  })
  return html
}
