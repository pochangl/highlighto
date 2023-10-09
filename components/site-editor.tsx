import { Button, Card, CardContent, Grid, Icon, TextField } from '@mui/material'
import { Component } from 'react'

import { saveSite } from '~utils/api'
import type { IRule } from '~utils/highlight'
import type { ISite } from '~utils/site'

function RuleEditor({
  rule,
  onRemove
}: {
  rule: IRule
  onRemove?: (rule: IRule) => void
}) {
  return (
    <Grid container columnGap={3}>
      <TextField
        defaultValue={rule.pattern}
        label="Pattern"
        onChange={(event) => {
          rule.pattern = event.target.value
        }}
      />
      <TextField
        defaultValue={rule.backgroundColor}
        label="Color"
        onChange={(event) => {
          rule.backgroundColor = event.target.value
        }}
      />
      <TextField
        defaultValue={rule.fontColor}
        label="Color"
        onChange={(event) => {
          rule.fontColor = event.target.value
        }}
      />
      {onRemove && (
        <Button onClick={() => onRemove(rule)}>
          <Icon> delete </Icon>
        </Button>
      )}
    </Grid>
  )
}
export class SiteEditor extends Component<
  { site: ISite },
  { version: number }
> {
  constructor(props) {
    super(props)
    this.state = { version: 1 }
  }
  save() {
    return saveSite(this.props.site)
  }

  removeRule(rule: IRule) {
    console.log('removing', this.props.site.rules.length, rule)
    this.props.site.rules = this.props.site.rules.filter((r) => r !== rule)
    console.log('removed', this.props.site.rules.length, rule)
    this.setState({ version: this.state.version + 1 })
  }

  render() {
    return (
      <Grid container direction="column" rowGap={3}>
        <div>uri pattern:</div>
        <TextField
          style={{ width: '100%' }}
          defaultValue={this.props.site.uri_pattern}
          onChange={(event) =>
            (this.props.site.uri_pattern = event.target.value)
          }
        />
        {this.props.site.rules.map((rule, index) => (
          <RuleEditor
            key={rule.pattern + index}
            rule={rule}
            onRemove={(r) => this.removeRule(r)}
          />
        ))}
        <Button
          onClick={() => {
            this.props.site.rules.push({
              pattern: '',
              backgroundColor: 'blue',
              fontColor: 'white'
            })
            this.setState({ version: this.state.version + 1 })
          }}
          variant="contained">
          New Rule
        </Button>
        <Button type="submit" variant="contained" onClick={() => this.save()}>
          Save
        </Button>
      </Grid>
    )
  }
}

/** simple rule editor for editing keyword in frontend */
export class SingleRuleEditor extends Component<
  { site: ISite; rule: IRule },
  { version: number }
> {
  render() {
    return (
      <Card elevation={0}>
        <CardContent>
          <Grid container direction="column" rowGap={3}>
            <div>uri pattern:</div>
            <TextField
              style={{ width: '600px' }}
              defaultValue={this.props.site.uri_pattern}
              onChange={(event) =>
                (this.props.site.uri_pattern = event.target.value)
              }
            />
            <RuleEditor rule={this.props.rule} />
          </Grid>
        </CardContent>
      </Card>
    )
  }
}
