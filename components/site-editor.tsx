import { Button, Grid, TextField } from '@mui/material'
import { Component } from 'react'

import { saveSite } from '~utils/api'
import type { IRule } from '~utils/highlight'
import type { ISite } from '~utils/site'

function RuleEditor({ rule }: { rule: IRule }) {
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
          <RuleEditor key={index} rule={rule} />
        ))}
        <Button
          onClick={() => {
            this.props.site.rules.push({
              pattern: '',
              backgroundColor: '0000FF'
            })
            this.setState({ version: this.state.version + 1 })
          }}
          variant="contained">
          New Rule
        </Button>
        <Button type="submit" variant="contained" onClick={() => this.save()}>Save</Button>
      </Grid>
    )
  }
}
