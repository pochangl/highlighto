import type { IRule } from "./highlight"

export interface ISite {
  id?: number
  uri_pattern: string
  rules: IRule[]
}

export interface ISites {
  [key: string]: ISite
}

export function findSite(uri: string, sites: ISites):  ISite | null {
  for (const [uri_pattern, site] of Object.entries(sites)) {
    const pattern = new RegExp(uri_pattern)
    if (uri.search(pattern) >= 0) {
      return site
    }
  }
  return null
}
