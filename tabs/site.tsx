import { useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { SiteEditor } from '~components/site-editor'
import { loadSites, type ISite } from '~utils/site'

export interface ISitePageArgument {
  siteId?: string
  uri_pattern?: string
}

function getParams<T>() {
  const url = new URL(window.location.href)
  return Object.fromEntries(url.searchParams.entries()) as T
}

function IndexNewtab() {
  const storage = new Storage({
    area: 'local'
  })
  const params = getParams<ISitePageArgument>()
  const [site, setSite] = useState<ISite>({
    uri_pattern: params.uri_pattern,
    rules: []
  })

  const [loaded, setLoaded] = useState(false)
  if (params.siteId && !loaded) {
    loadSites(storage).then((sites) => {
      const id = parseInt(params.siteId)
      for (const site of Object.values(sites)) {
        if (site.id === id) {
          setLoaded(true)
          setSite(site)
        }
      }
    })

    // update site
  }
  return <SiteEditor site={site} key={site.id ?? 0}></SiteEditor>
}

export default IndexNewtab
