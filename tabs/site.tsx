import { useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { SiteEditor } from '~components/site-editor'
import { retrieveSite, type ISite } from '~utils/site'

export interface ISitePageArgument {
  siteId?: string
  uri_pattern?: string
}

function getParams<T>() {
  const url = new URL(window.location.href)
  return Object.fromEntries(url.searchParams.entries()) as T
}

const storage = new Storage({
  area: 'local'
})

storage.watch({
  sites(_) {
    flush()
  }
})

let flush: () => void

function IndexNewtab() {
  const params = getParams<ISitePageArgument>()
  const [site, setSite] = useState<ISite>({
    uri_pattern: params.uri_pattern,
    rules: []
  })

  flush = async () => {
    const new_site = await retrieveSite(storage, site.id)
    if (new_site) {
      setSite(new_site)
    }
  }

  const [loaded, setLoaded] = useState(false)
  if (params.siteId && !loaded) {
    const id = parseInt(params.siteId)
    retrieveSite(storage, id).then((site) => {
      if (site) {
        setLoaded(true)
        setSite(site)
      }
    })

    // update site
  }
  return <SiteEditor site={site} key={site.id ?? 0}></SiteEditor>
}

export default IndexNewtab
