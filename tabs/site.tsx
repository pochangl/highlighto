import { useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { SiteEditor } from '~components/site-editor'
import { buildRule, buildSite, retrieveSite, type ISite } from '~utils/site'

import '~assets/material-icons-font.css'

export type ISitePageArgument =
  | {
      id: string
    }
  | {
      uri_pattern: string
      name: string
      pattern?: string
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
  const params: { id?: string; name?: string; uri_pattern?: string } =
    getParams<ISitePageArgument>()
  const [site, setSite] = useState<ISite>(
    buildSite({
      uri_pattern: params.uri_pattern,
      rules: [
        buildRule({
          pattern: params.uri_pattern
        })
      ],
      name: params.name
    })
  )

  flush = async () => {
    const newSite = await retrieveSite(storage, site.id)
    if (newSite) {
      setSite(newSite)
    }
  }

  const [loaded, setLoaded] = useState(false)
  if (params.id && !loaded) {
    const id = params.id
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
