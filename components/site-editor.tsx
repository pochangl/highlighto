import { Component } from 'react'
import { saveSite } from '~utils/api'
import type { IRule } from '~utils/highlight'
import type { ISite } from '~utils/site'

function deepcopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

class TextField extends Component<{
  value: string
  onChange: (value: string) => void
}, {text: string}> {
  constructor(props) {
    super(props);
    this.state = {text: props.value}
  }

  render() {
    return <input value={this.state.text} onChange={(event) => {
      const value = event.target.value
      this.setState({
        text: value
      })
      this.props.onChange(value)
    }} />
  }
}

function RuleEditor({
  rule,
  onChange
}: {
  rule: IRule
  onChange: (value: IRule) => void
}) {
  rule = deepcopy(rule)

  return (
    <p>
      Pattern:&nbsp;
      <TextField
        value={rule.pattern}
        onChange={(value) => {
          rule.pattern = value
          onChange(rule)
        }}
      />
      &nbsp; Color:&nbsp;
      <TextField
        value={rule.backgroundColor}
        onChange={(value) => {
          rule.backgroundColor = value
          onChange(rule)
        }}
      />
    </p>
  )
}

export function SiteEditor({site}: {site: ISite}) {
  site = deepcopy(site) // replicate site data

  function save() {
    return saveSite(site)
  }

  return (
    <form onSubmit={save}>
      <div>
        <table>
          <p>
            uri pattern: &nbsp;
            <TextField
              value={site.uri_pattern}
              onChange={(value) => site.uri_pattern}
            />
          </p>
          {site.rules.map((rule, index) => (
            <RuleEditor
              key={index}
              rule={rule}
              onChange={(value) => Object.assign(rule, value)}
            />
          ))}
          <input type="submit" value="Save" />
        </table>
      </div>
    </form>
  )
}
