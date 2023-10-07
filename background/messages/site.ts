import type { PlasmoMessaging } from '@plasmohq/messaging'

import { findSite, type ISite, type ISites } from '~utils/site'

const sites: ISites = Object.fromEntries(new Map([
  {
    uri_pattern: 'https://docs.plasmo.com',
    rules: [
      {
        pattern: 'Welcome',
        backgroundColor: 'FF0000'
      }
    ]
  }
].map((site) => {
  return [site.uri_pattern, site]
})))

export interface IGetSiteRequest {
  action: 'get'
  uri: string
}

export interface ISaveSiteRequest {
  action: 'save'
  site: ISite
}

export interface ISiteResponseData {
  errorCode: number
  site?: ISite
}

function getSite(pattern: string, sites: ISites) {
  return sites[pattern] || null
}

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, IGetSiteRequest | ISaveSiteRequest>,
  res: PlasmoMessaging.Response<ISiteResponseData>
) => {
  if (req.body.action == 'get') {
    const uri = req.body.uri
    const site = findSite(uri, sites)
    res.send({ errorCode: 0, site: site })
  } else if (req.body.action == 'save') {
    const pattern = req.body.site.uri_pattern
    const site = getSite(pattern, sites)
    if (site) {
      Object.assign(site, req.body.site)
    } else {
      sites[pattern] = req.body.site
    }
    res.send({ errorCode: 0 })
  } else {
    res.send({ errorCode: 404 })
  }
}

export default handler
