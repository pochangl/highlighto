import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import {
  findSite,
  overwriteSite,
  type ISavedSite,
  type ISite,
  type ISites
} from '~utils/site'

export async function loadSites(storage: Storage) {
  const siteStr = (await storage.get('sites')) ?? '[]'
  const listSites: ISavedSite[] = JSON.parse(siteStr)
  return Object.fromEntries(
    new Map(listSites.map((site) => [site.uri_pattern, site]))
  )
}

export async function saveSites(storage: Storage, sites: ISites) {
  const listSites: ISavedSite[] = Object.values(sites)
  const sitesStr = JSON.stringify(listSites)
  await storage.set('sites', sitesStr)
}

const storage = new Storage({
  area: 'local'
})

let sites: ISites

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

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, IGetSiteRequest | ISaveSiteRequest>,
  res: PlasmoMessaging.Response<ISiteResponseData>
) => {
  if (!sites) {
    sites = await loadSites(storage)
  }
  if (req.body.action == 'get') {
    const uri = req.body.uri
    const site = findSite(uri, sites)
    return res.send({ errorCode: 0, site: site })
  } else if (req.body.action == 'save') {
    try {
      overwriteSite(req.body.site, sites)
      saveSites(storage, sites)
    } catch (error) {
      return res.send({ errorCode: 400 })
    }
    return res.send({ errorCode: 0 })
  } else {
    return res.send({ errorCode: 404 })
  }
}

export default handler
