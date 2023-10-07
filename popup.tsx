import { Component } from 'react'

import { sendToBackground } from '@plasmohq/messaging'

import type { IGetSiteRequest, ISiteResponseData } from '~background/messages/site'
import { SiteEditor } from '~components/site-editor'
import type { ISite } from '~utils/site'

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
    const resp = await sendToBackground<IGetSiteRequest, ISiteResponseData>({
      name: 'site',
      body: {
        action: 'get',
        uri: tab.url
      }
    })
    this.setState({
      site: resp.site
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
