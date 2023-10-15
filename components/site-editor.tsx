import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { Component, useState } from 'react'

import { saveSite } from '~utils/api'
import type { IRule } from '~utils/highlight'
import {
  buildGroup,
  buildRule,
  getRules,
  IGroup,
  ISiteRule,
  type ISite
} from '~utils/site'

function useUpdater() {
  const [version, setVersion] = useState(1)
  function setState<T>(func: (event: T) => void | Promise<void>) {
    async function wrapper(event: T) {
      await func(event)
      setVersion(version + 1)
    }
    return wrapper
  }
  return setState
}

function RuleEditor({
  rule,
  groups,
  onRemove
}: {
  rule: ISiteRule
  groups: IGroup[]
  onRemove?: (rule: ISiteRule) => void
}) {
  const update = useUpdater()
  const appliedRule = getRules(groups, [rule])[0]
  const isGroupRule = groups.some((group) => group.id == rule.group)
  const style = isGroupRule ? { opacity: 0.1 } : {}
  return (
    <Grid container columnGap={3}>
      <TextField
        defaultValue={rule.pattern}
        label="Pattern"
        onChange={(event) => {
          rule.pattern = event.target.value
        }}
      />
      <FormControl>
        <InputLabel>group</InputLabel>
        <Select
          label="group"
          value={rule.group || ''}
          style={{ width: '100px' }}
          onChange={update((event) => {
            rule.group = event.target.value || ''
          })}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {groups.map((group) => (
            <MenuItem
              value={group.id}
              key={group.id}
              style={{
                backgroundColor: group.backgroundColor,
                color: group.fontColor
              }}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        defaultValue={rule.backgroundColor}
        label="Background color"
        style={style}
        onChange={update((event) => {
          rule.backgroundColor = event.target.value
        })}
      />
      <TextField
        defaultValue={rule.fontColor}
        label="Font color"
        style={style}
        onChange={update((event) => {
          rule.fontColor = event.target.value
        })}
      />
      <Grid item>
        <span
          style={{
            color: appliedRule.fontColor,
            backgroundColor: appliedRule.backgroundColor
          }}>
          Example
        </span>
      </Grid>
      <TextField
        defaultValue={rule.note}
        label="Note"
        onChange={update((event) => {
          rule.note = event.target.value
        })}
      />
      {onRemove && (
        <Button onClick={() => onRemove(rule)}>
          <Icon> delete </Icon>
        </Button>
      )}
    </Grid>
  )
}

function GroupEditor({
  group,
  onRemove
}: {
  group: IGroup
  onRemove?: (group: IGroup) => void
}) {
  const update = useUpdater()
  return (
    <Grid container columnGap={3}>
      <TextField
        defaultValue={group.name}
        label="name"
        onChange={(event) => {
          group.name = event.target.value
        }}
      />
      <TextField
        defaultValue={group.backgroundColor}
        label="Background color"
        onChange={update((event) => {
          group.backgroundColor = event.target.value
        })}
      />
      <TextField
        defaultValue={group.fontColor}
        label="font color"
        onChange={update((event) => {
          group.fontColor = event.target.value
        })}
      />
      <Grid item>
        <span
          style={{
            color: group.fontColor,
            backgroundColor: group.backgroundColor
          }}>
          Example
        </span>
      </Grid>
      {onRemove && (
        <Button onClick={() => onRemove(group)}>
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
    this.props.site.rules = this.props.site.rules.filter((r) => r !== rule)
    this.setState({ version: this.state.version + 1 })
  }

  removeGroup(group: IGroup) {
    this.props.site.groups = this.props.site.groups.filter((r) => r !== group)
    this.setState({ version: this.state.version + 1 })
  }

  render() {
    return (
      <Grid container direction="column" rowGap={3}>
        <Grid container direction="row">
          <Button href={new URL('./sites.html', location.href).href}>
            <Icon>arrow_back</Icon>
          </Button>
        </Grid>

        <TextField
          label="name"
          style={{ width: '60%' }}
          defaultValue={this.props.site.name}
          onChange={(event) => {
            this.props.site.name = event.target.value
          }}
        />
        <TextField
          label="Uri Pattern"
          style={{ width: '100%' }}
          defaultValue={this.props.site.uri_pattern}
          onChange={(event) =>
            (this.props.site.uri_pattern = event.target.value)
          }
        />
        <p> groups: </p>
        {this.props.site.groups.map((group, index) => (
          <GroupEditor
            key={group.id + index}
            group={group}
            onRemove={(r) => this.removeGroup(r)}
          />
        ))}
        <Button
          onClick={() => {
            this.props.site.groups.push(
              buildGroup({
                name: '',
                backgroundColor: 'blue',
                fontColor: 'white'
              })
            )
            this.setState({ version: this.state.version + 1 })
          }}
          variant="contained">
          New Group
        </Button>
        <p> rules: </p>
        {this.props.site.rules.map((rule, index) => (
          <RuleEditor
            key={rule.pattern + index}
            rule={rule}
            groups={this.props.site.groups}
            onRemove={(r) => this.removeRule(r)}
          />
        ))}
        <Button
          onClick={() => {
            this.props.site.rules.push(
              buildRule({
                pattern: '',
                backgroundColor: 'blue',
                fontColor: 'white'
              })
            )
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
  { site: ISite; rule: ISiteRule },
  { version: number }
> {
  render() {
    return (
      <Card elevation={0}>
        <CardContent>
          <Grid container direction="column" rowGap={3}>
            <TextField
              label="name"
              style={{ width: '60%' }}
              defaultValue={this.props.site.name}
              onChange={(event) => {
                this.props.site.name = event.target.value
              }}
            />
            <TextField
              label="Uri pattern"
              style={{ width: '600px' }}
              defaultValue={this.props.site.uri_pattern}
              onChange={(event) =>
                (this.props.site.uri_pattern = event.target.value)
              }
            />
            <RuleEditor
              rule={this.props.rule}
              groups={this.props.site.groups}
            />
          </Grid>
        </CardContent>
      </Card>
    )
  }
}
