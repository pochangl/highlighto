import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider
} from '@mui/material'
import type { PlasmoCreateShadowRoot, PlasmoCSConfig } from 'plasmo'
import { useState } from 'react'

import type { PlasmoMessaging } from '@plasmohq/messaging'

import type { IMenuEvent } from '~background/messages/site'
import { SingleRuleEditor } from '~components/site-editor'
import { guessSite, saveSite } from '~utils/api'
import { highlight } from '~utils/highlight'
import {
  buildRule,
  buildSite,
  getRules,
  type ISite,
  type ISiteRule
} from '~utils/site'

const styleElement = document.createElement('style')

const styleCache = createCache({
  key: 'plasmo-mui-cache',
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement
export const config: PlasmoCSConfig = {
  matches: ['*://*/*'],
  run_at: 'document_end'
}

let cachedHtml: string

function flushKeywords(site: ISite) {
  if (!cachedHtml) {
    cachedHtml = document.body.innerHTML
  }
  document.body.innerHTML = highlight({
    html: cachedHtml,
    rules: getRules(site.groups, site.rules)
  })
}

async function update() {
  const site = await guessSite(window.location.href)
  if (site !== null) {
    flushKeywords(site)
  }
}

update()

chrome.runtime.onMessage.addListener(function (
  request: PlasmoMessaging.Request<string, IMenuEvent>
) {
  onSelection(request.body)
})

let onSelection: (item: IMenuEvent) => void

const Content = () => {
  const [selected, setSelect] = useState(false)
  const [site, setSite] = useState<ISite>(
    buildSite({
      uri_pattern: window.location.href
    })
  )
  const [rule, setRule] = useState<ISiteRule>(
    buildRule({
      pattern: '',
      group: null
    })
  )
  onSelection = async (event) => {
    const site = await guessSite(window.location.href)
    if (site) {
      setSite(site)
    }
    setRule({
      ...rule,
      pattern: event.selection
    })
    setSelect(true)
  }
  async function onSave(rule: ISiteRule) {
    site.rules.push(rule)
    await saveSite(site)

    setSelect(false)
    flushKeywords(site)
  }
  const theme = createTheme({
    components: {
      MuiDialog: {
        defaultProps: {
          container: shadowRoot.children['plasmo-shadow-container']
        }
      },
      MuiSelect: {
        defaultProps: {
          // @ts-ignore */
          container: shadowRoot.children['plasmo-shadow-container']
        }
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={styleCache}>
        <Dialog open={selected} onClose={() => setSelect(false)}>
          <DialogTitle> New Rule </DialogTitle>
          <DialogContent>
            <SingleRuleEditor site={site} rule={rule} key={rule.pattern} />
          </DialogContent>
          <DialogActions>
            <Button type="submit" onClick={() => setSelect(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={() => onSave(rule)}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CacheProvider>
    </ThemeProvider>
  )
}

export default Content
export const getShadowHostId = 'hid'

let shadowRoot: ShadowRoot

export const createShadowRoot: PlasmoCreateShadowRoot = function (shadowHost) {
  shadowRoot = shadowHost.attachShadow({ mode: 'open' })
  return shadowRoot
}
