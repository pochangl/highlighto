export interface IRule {
  color: string
  pattern: string
}

export interface IHighlight {
  urlPattern: string
}

export function highlight(options: { html: string; rules: IRule[] }) {
  let html = options.html
  for (const pattern of options.rules) {
    html = html.replace(pattern.pattern, function (match) {
      return `<span class="_highlighto" style="background-color: #${pattern.color}">${match}</span>`
    })
  }
  return html
}
