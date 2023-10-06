import type { PlasmoMessaging } from '@plasmohq/messaging'

import { findSite, type ISite } from '~utils/site'

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

function getSite(pattern: string, sites: ISite[]) {
  for (const site of sites) {
    if (site.uri_pattern == pattern) {
      return site
    }
  }
  return null
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
      sites.push(req.body.site)
    }
    res.send({ errorCode: 0 })
  } else {
    res.send({ errorCode: 404 })
  }
}

export default handler
