import { sendToContentScript, type PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import {
  findSite,
  loadSites,
  overwriteSite,
  saveSites,
  type ISite,
  type ISites
} from '~utils/site'

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

export interface IMenuEvent {
  selection: string
  url: string
}

const SelectionEventID = 'highlighto-selection'

chrome.contextMenus.create({
  id: SelectionEventID,
  title: 'highlight keyword',
  contexts: ['selection']
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  info.menuItemId
  const selection = info.selectionText
  const url = tab.url

  sendToContentScript<IMenuEvent>({
    tabId: tab.id,
    name: 'highlighto-selection',
    body: {
      selection,
      url
    }
  })
})
