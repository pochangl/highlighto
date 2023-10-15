import type { Storage } from '@plasmohq/storage'

import type { IColorSetting, IRule } from './highlight'
import { getUid64 } from './uid'

export interface ISiteRule extends IRule {
  id: string
  group: string
}

export interface IGroup extends IColorSetting {
  /** color groups */
  id: string
  name: string
}

export interface ISite {
  id: string
  name: string
  uri_pattern: string
  rules: ISiteRule[]
  groups: IGroup[]
}

export interface ISites {
  [key: string]: ISite
}

export function findSite(uri: string, sites: ISites): ISite | null {
  for (const [uriPattern, site] of Object.entries(sites)) {
    const pattern = new RegExp(uriPattern)
    if (uri.search(pattern) >= 0) {
      return site
    }
  }
  return null
}

class SiteOperationError extends Error {}

export function overwriteSite(obj: ISite, sites: ISites) {
  // in place overwrite site

  const site = sites[obj.uri_pattern]
  if (site && obj.id !== site.id) {
    throw new SiteOperationError('pattern already defined')
  } else if (site && obj.id === site.id) {
    Object.assign(site, obj)
  } else if (obj.id) {
    for (const site of Object.values(sites)) {
      if (obj.id === site.id) {
        delete sites[site.uri_pattern]
        sites[obj.uri_pattern] = obj
        return
      }
    }
    sites[obj.uri_pattern] = obj
  }
}

export async function loadSites(storage: Storage) {
  const siteStr = (await storage.get('sites')) ?? '[]'
  let listSites: ISite[] = JSON.parse(siteStr)
  listSites = listSites.map(buildSite)
  return Object.fromEntries(
    new Map(listSites.map((site) => [site.uri_pattern, site]))
  )
}

export async function saveSites(storage: Storage, sites: ISites) {
  const listSites: ISite[] = Object.values(sites)
  const sitesStr = JSON.stringify(listSites)
  await storage.set('sites', sitesStr)
}

export async function retrieveSite(
  storage: Storage,
  id: string
): Promise<ISite | null> {
  const siteStr = (await storage.get('sites')) ?? '[]'
  const sites: ISite[] = JSON.parse(siteStr)

  for (const site of sites) {
    if (site.id === id) {
      return site
    }
  }
  return null
}

export function buildRule(options: Partial<ISiteRule>): ISiteRule {
  const defaultValue: ISiteRule = {
    id: getUid64(),
    group: '',
    pattern: '',
    backgroundColor: 'blue',
    fontColor: 'white',
    note: ''
  }
  return Object.assign({}, defaultValue, options)
}

export function buildGroup(options: Partial<IGroup>): IGroup {
  const defaultValue: IGroup = {
    id: getUid64(),
    name: '',
    backgroundColor: 'blue',
    fontColor: 'white'
  }
  return Object.assign({}, defaultValue, options)
}

export function buildSite(options: Partial<ISite>): ISite {
  /**
   * initialize site objects with default attributes
   */
  const defaultValue: ISite = {
    id: getUid64(),
    name: '',
    uri_pattern: '',
    rules: [buildRule({})],
    groups: [
      buildGroup({
        name: 'default'
      })
    ]
  }
  return Object.assign(defaultValue, options)
}

export function getRules(
  groups: Readonly<IGroup>[],
  rules: Readonly<ISiteRule>[]
): Readonly<IRule>[] {
  const groupMap = new Map(groups.map((group) => [group.id, group]))
  return rules.map((rule) => {
    const group = groupMap.get(rule.group)
    if (group) {
      const color: IColorSetting = {
        fontColor: group.fontColor,
        backgroundColor: group.backgroundColor
      }
      return Object.assign({}, rule, color)
    } else {
      return rule
    }
  })
}
