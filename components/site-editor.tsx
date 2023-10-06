import { IRule } from '~utils/highlight'
import { ISite } from '~utils/site'

function deepcopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function TextField({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input value={value} onChange={(event) => onChange(event.target.value)} />
  )
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
        value={rule.pattern}
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

  function save() {}

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
          {site.rules.map((rule) => (
            <RuleEditor
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
