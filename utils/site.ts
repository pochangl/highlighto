import type { IRule } from "./highlight"

export interface ISite {
  uri_pattern: string
  rules: IRule[]
}

export function findSite(uri: string, sites: ISite[]):  ISite | null {
  for (const site of sites) {
    const pattern = new RegExp(site.uri_pattern)
    if (uri.search(pattern) >= 0) {
      return site
    }
  }
  return null
}