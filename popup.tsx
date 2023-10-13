import '~assets/material-icons-font.css'

import { Button, Grid } from '@mui/material'
import Icon from '@mui/material/Icon'
import { Component } from 'react'

import type { ISitePageArgument } from '~tabs/site'
import { guessSite } from '~utils/api'
import type { ISite } from '~utils/site'
import { gotoTab } from '~utils/tab'

function getActiveTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab) {
        reject()
      } else {
        resolve(activeTab)
      }
    })
  })
}

class Popup extends Component<{}, { site: ISite | null; ready: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = {
      site: null,
      ready: false
    }
    this.getSite()
  }

  async getSite() {
    const tab = await getActiveTab()
    const site = await guessSite(tab.url)

    this.setState({
      site,
      ready: true
    })
    if (site) {
      gotoTab<ISitePageArgument>('site.html', { id: site.id.toString() })
    }
  }

  async addNew() {
    const tab = await getActiveTab()
    gotoTab<ISitePageArgument>('site.html', {
      uri_pattern: tab.url,
      name: tab.title
    })
  }

  render() {
    if (!this.state.ready || this.state.site) {
      return <div style={{ display: 'none' }} />
    } else {
      return (
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          alignItems="center"
          style={{ width: '200px', height: '80px' }}>
          <span> No rulefound for this url </span>
          <Button onClick={() => this.addNew()} variant="contained">
            <Grid container alignItems="center">
              <Icon fontSize="small">add</Icon>
              &nbsp;
              <span>New rule</span>
            </Grid>
          </Button>
        </Grid>
      )
    }
  }
}

function IndexPopup() {
  return <Popup />
}
export default IndexPopup
