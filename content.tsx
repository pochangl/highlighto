import type { PlasmoCSConfig } from 'plasmo'

import { sendToBackground } from '@plasmohq/messaging'

import type { IGetSiteRequest, ISiteResponseData } from '~background/messages/site'
import { highlight } from '~utils/highlight'

export const config: PlasmoCSConfig = {
  matches: ['*://*/*'],
  run_at: 'document_idle'
}

async function update() {
  const response = await sendToBackground<IGetSiteRequest, ISiteResponseData>({
    name: 'site',
    body: {
      action: 'get',
      uri: window.location.href
    }
  })
  const site = response.site
  if (site !== null) {
    document.body.innerHTML = highlight({
      html: document.body.innerHTML,
      rules: site.rules
    })
  }
}

update()

const Content = () => {
  return <div style={{ display: 'hidden' }} />
}

export default Content
