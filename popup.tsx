import { Component } from 'react'
import { SiteEditor } from '~components/site-editor'
import type { ISite } from '~utils/site'
import { retrieveSite } from '~utils/api'

function getActiveTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0]
      if (!activeTab) {
        reject()
      } else {
        resolve(activeTab)
      }
    })
  })
}

class Popup extends Component<{}, { site: ISite | null }> {
  constructor(props: any) {
    super(props)
    this.state = {
      site: null
    }
    this.getSite()
  }

  async getSite() {
    const tab = await getActiveTab()
    const site = await retrieveSite(tab.url)
    this.setState({
      site: site
    })
  }

  render() {
    if (this.state.site) {
      return <SiteEditor site={this.state.site} />
    } else {
      return <div />
    }
  }
}

function IndexPopup() {
  return <Popup />
}
export default IndexPopup
