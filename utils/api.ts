import { sendToBackground } from '@plasmohq/messaging'

import type {
  IGetSiteRequest,
  ISaveSiteRequest,
  ISiteResponseData
} from '~background/messages/site'

import type { ISite } from './site'

export async function retrieveSite(pattern: string) {
  const response = await sendToBackground<IGetSiteRequest, ISiteResponseData>({
    name: 'site',
    body: {
      action: 'get',
      uri: pattern
    }
  })
  return response.site
}

export function saveSite(site: ISite) {
  return sendToBackground<ISaveSiteRequest, ISiteResponseData>({
    name: 'site',
    body: {
      action: 'save',
      site
    }
  })
}
