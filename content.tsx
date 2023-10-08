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
import { retrieveSite, saveSite } from '~utils/api'
import { highlight, type IRule } from '~utils/highlight'
import type { ISite } from '~utils/site'

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

async function update() {
  const site = await retrieveSite(window.location.href)
  if (site !== null) {
    document.body.innerHTML = highlight({
      html: document.body.innerHTML,
      rules: site.rules
    })
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
  const [site, setSite] = useState<ISite>({
    uri_pattern: window.location.href,
    rules: []
  })
  const [rule, setRule] = useState<IRule>({
    pattern: '',
    fontColor: 'white',
    backgroundColor: 'blue'
  })
  onSelection = async (event) => {
    const site = await retrieveSite(window.location.href)
    if (site) {
      setSite(site)
    }
    setRule({
      ...rule,
      pattern: event.selection
    })
    setSelect(true)
  }
  async function onSave(rule: IRule) {
    site.rules.push(rule)
    await saveSite(site)
    setSelect(false)
  }
  const theme = createTheme({
    components: {
      MuiDialog: {
        defaultProps: {
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
