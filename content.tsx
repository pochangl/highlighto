import type { PlasmoCSConfig } from 'plasmo'

import { highlight } from '~utils/highlight'
import { findSite } from '~utils/site'
import type { ISite } from '~utils/site'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  run_at: 'document_idle'
}

const sites: ISite[] = [
  {
    uri_pattern: 'https://docs.plasmo.com',
    rules: [
      {
        pattern: 'Welcome',
        backgroundColor: 'FF0000'
      }
    ]
  }
]

const site = findSite(window.location.href, sites)

if (site !== null) {
  document.body.innerHTML = highlight({
    html: document.body.innerHTML,
    rules: site.rules
  })
}
