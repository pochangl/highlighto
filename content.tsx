import type { PlasmoCSConfig } from 'plasmo'

import { retrieveSite } from '~utils/api'
import { highlight } from '~utils/highlight'

export const config: PlasmoCSConfig = {
  matches: ['*://*/*'],
  run_at: 'document_idle'
}

async function update() {
  const site = await retrieveSite(window.location.href)
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
