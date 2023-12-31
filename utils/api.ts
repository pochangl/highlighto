import { sendToBackground } from '@plasmohq/messaging'

import type {
  IGetSiteRequest,
  ISaveSiteRequest,
  ISiteResponseData
} from '~background/messages/site'
import type { ITabRequest } from '~background/messages/tab'

import type { ISite } from './site'

export async function guessSite(pattern: string) {
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

export function openTab<T extends { [key: string]: String }>(
  path: string,
  data: T
) {
  return sendToBackground<ITabRequest<T>>({
    name: 'tab',
    body: {
      path,
      data
    }
  })
}
