import type { Storage } from '@plasmohq/storage'

import type { IColorSetting, IRule } from './highlight'

export interface ISiteRule extends IRule {
  group: number | null
}

export interface IGroup extends IColorSetting {
  /** color groups */
  id?: number
  name: string
}

export interface ISite {
  id?: number
  name: string
  uri_pattern: string
  rules: ISiteRule[]
  groups: IGroup[]
}

export interface ISavedSite extends ISite {
  id: number
  groups: IGroup[]
}

export interface ISites {
  [key: string]: ISavedSite
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
        sites[obj.uri_pattern] = obj as ISavedSite
        break
      }
    }
  } else {
    // new pattern
    const max = Math.max(0, ...Object.values(sites).map((site) => site.id))
    sites[obj.uri_pattern] = Object.assign({}, obj, { id: max + 1 })
  }
}

export async function loadSites(storage: Storage) {
  const siteStr = (await storage.get('sites')) ?? '[]'
  let listSites: ISavedSite[] = JSON.parse(siteStr)
  listSites = listSites.map(buildSite<ISavedSite>)
  return Object.fromEntries(
    new Map(listSites.map((site) => [site.uri_pattern, site]))
  )
}

export async function saveSites(storage: Storage, sites: ISites) {
  const listSites: ISavedSite[] = Object.values(sites)
  const sitesStr = JSON.stringify(listSites)
  await storage.set('sites', sitesStr)
}

export async function retrieveSite(
  storage: Storage,
  id: number
): Promise<ISavedSite | null> {
  const siteStr = (await storage.get('sites')) ?? '[]'
  const sites: ISavedSite[] = JSON.parse(siteStr)

  for (const site of sites) {
    if (site.id === id) {
      return site
    }
  }
  return null
}

export function buildRule(options: Partial<ISiteRule>): ISiteRule {
  const defaultValue: ISiteRule = {
    group: null,
    pattern: '',
    backgroundColor: 'blue',
    fontColor: 'white'
  }
  return Object.assign({}, defaultValue, options)
}

export function buildGroup(options: Partial<IGroup>): IGroup {
  const defaultValue: IGroup = {
    name: '',
    backgroundColor: 'blue',
    fontColor: 'white'
  }
  return Object.assign({}, defaultValue, options)
}

export function buildSite<T extends Partial<ISite>>(options: T): T & ISite {
  /**
   * initialize site objects with default attributes
   */
  const defaultValue: ISite = {
    name: '',
    uri_pattern: '',
    rules: [buildRule({})],
    groups: [
      buildGroup({
        id: 1,
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
