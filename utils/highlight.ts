export interface IRule {
  backgroundColor: string
  fontColor: string
  pattern: string
}

export function highlight(options: { html: string; rules: IRule[] }) {
  let html = options.html
  let regex = new RegExp(
    options.rules.map((rule) => rule.pattern).join('|'),
    'gi'
  )
  let map = Object.fromEntries(
    new Map(options.rules.map((rule) => [rule.pattern, { background: rule.backgroundColor, color: rule.fontColor}]))
  )
  html = html.replace(/>(?<text>[^<>]+)</gi, function(...args1) {
    // replace text part of html
    let text = args1.at(-1).text
    // replace keywords
    text = text.replace(regex, function(matched) {
      let color = map[matched]
      return `<span class="_highlighto" style="background-color: ${color.background}; color: ${color.color}">${matched}</span>`
    })
    return `>${text}<`
  })
  return html
}
