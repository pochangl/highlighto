import type { IRule } from "./highlight"

export interface ISite {
  uri_pattern: string
  rules: IRule[]
}

export function findSite(uri: string, sites: ISite[]):  ISite | null {
  for (const site of sites) {
    if (uri == site.uri_pattern) {
      return site
    }
  }
  return null
}