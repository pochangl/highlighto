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

export interface ISiteResponseData {
  errorCode: number
  site?: ISite
}

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, IGetSiteRequest>,
  res: PlasmoMessaging.Response<ISiteResponseData>
) => {
  if (req.body.action == 'get') {
    const uri = req.body.uri
    const site = findSite(uri, sites)
    res.send({ errorCode: 0, site: site })
  } else {
    res.send({ errorCode: 404 })
  }
}

export default handler
