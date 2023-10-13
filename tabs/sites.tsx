import { useState } from 'react'

import { Storage } from '@plasmohq/storage'

import { loadSites, saveSites, type ISite, type ISites } from '~utils/site'

import '~assets/material-icons-font.css'

import { Button, Grid, Icon } from '@mui/material'

const storage = new Storage({
  area: 'local'
})

storage.watch({
  sites(_) {
    flush()
  }
})

let flush: () => Promise<void>

function siteHref(site: ISite) {
  const uri = new URL('./site.html', location.toString())
  uri.searchParams.append('siteId', site.id)
  return uri.toString()
}

function SitesEditor(options: {
  sites: ISites
  onDelete: (site: ISite) => void
}) {
  const sites = Object.values(options.sites).sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  )
  return (
    <Grid container direction="column" rowGap={3}>
      {sites.map((site) => (
        <Grid container direction="row" key={site.id}>
          <Grid item xs={9}>
            {site.name}
          </Grid>
          <Grid item xs={3}>
            <Button onClick={() => options.onDelete(site)}>
              <Icon>delete</Icon>
            </Button>
            <Button href={siteHref(site)}>
              <Icon>edit</Icon>
            </Button>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

function SitesTab() {
  const [sites, setSites] = useState<ISites>({})
  const [version, setVersion] = useState(1)
  const [loaded, setLoaded] = useState(false)

  flush = async () => {
    const newSites = await loadSites(storage)
    if (newSites) {
      setSites(newSites)
    } else {
      setSites({})
    }
    setVersion(version + 1)
  }

  if (!loaded) {
    flush().then(() => setLoaded(true))
  }

  async function onDelete(site: ISite) {
    const newSites = await loadSites(storage)
    for (const key in newSites) {
      if (newSites[key].id == site.id) {
        delete newSites[key]
        break
      }
    }
    await saveSites(storage, newSites)
  }

  return (
    <SitesEditor sites={sites} onDelete={onDelete} key={version}></SitesEditor>
  )
}

export default SitesTab
