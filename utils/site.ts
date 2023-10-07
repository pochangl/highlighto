import type { IRule } from './highlight'

export interface ISite {
  id?: number
  uri_pattern: string
  rules: IRule[]
}

export interface ISites {
  [key: string]: ISite & { id: number }
}

export function findSite(uri: string, sites: ISites): ISite | null {
  for (const [uri_pattern, site] of Object.entries(sites)) {
    const pattern = new RegExp(uri_pattern)
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
    console.log('case 1')
    throw new SiteOperationError('pattern already defined')
  } else if (site && obj.id === site.id) {
    console.log('case 2')
    Object.assign(site, obj)
  } else if (obj.id) {
    for (const site of Object.values(sites)) {
      if (obj.id === site.id) {
        delete sites[site.uri_pattern]
        sites[obj.uri_pattern] = obj as ISite & { id: number }
        break
      }
    }
  } else {
    console.log('case 4')
    // new pattern
    const max = Math.max(...Object.values(sites).map((site) => site.id))
    sites[obj.uri_pattern] = Object.assign({}, obj, { id: max })
  }
}
