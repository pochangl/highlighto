export interface IRule {
  backgroundColor: string
  pattern: string
}

export function highlight(options: { html: string; rules: IRule[] }) {
  let html = options.html
  let regex = new RegExp('(' + options.rules.map((rule) => rule.pattern).join('|') + ')', 'g')
  let map = Object.fromEntries(new Map(options.rules.map((rule) => [rule.pattern, rule.backgroundColor])))
  html = html.replace(regex, function (match) {
    let color = map[match]
    return `<span class="_highlighto" style="background-color: #${color}">${match}</span>`
  })
  return html
}
