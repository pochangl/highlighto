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
import type { ISitePageArgument } from '~tabs/site'
import { guessSite, openTab, saveSite } from '~utils/api'
import { createCompleter } from '~utils/async'
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

async function flushKeywords(site: ISite) {
  if (!cachedHtml) {
    cachedHtml = document.body.innerHTML
  }
  document.body.innerHTML = highlight({
    html: cachedHtml,
    rules: getRules(site.groups, site.rules)
  })

  const doms: NodeListOf<HTMLElement> =
    document.querySelectorAll('._highlighto')
  for (let dom of doms) {
    dom.onclick = onHighlightClick
  }
}
let completer = createCompleter<void>()

async function update() {
  const site = await guessSite(window.location.href)
  await completer.promise // waiting all function setup properly ex. onHighlightedClick
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
let onHighlightClick: (event: Event) => void

const Content = () => {
  const [selected, setSelect] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [site, setSite] = useState<ISite>(
    buildSite({
      name: document.title,
      uri_pattern: window.location.href,
      rules: []
    })
  )
  const [rule, setRule] = useState<ISiteRule>(
    buildRule({
      pattern: '',
      group: null
    })
  )

  onHighlightClick = async function (event: Event) {
    // find rule then edit rule
    const guessedSite = await guessSite(window.location.href)
    const keyword = (this as HTMLElement).innerText
    const highlightedRule = guessedSite.rules.filter(
      (rule) => rule.pattern.toLocaleLowerCase() === keyword.toLocaleLowerCase()
    )[0]
    if (highlightedRule) {
      setSite(guessedSite)
      setIsNew(false)
      setRule(highlightedRule)
      setSelect(true)
    }

    event.preventDefault()
  }
  onSelection = async (event) => {
    const site = await guessSite(window.location.href)
    if (site) {
      setSite(site)
      setIsNew(false)
    }
    setRule({
      ...rule,
      pattern: event.selection
    })
    setSelect(true)
  }
  try {
    completer.resolver() // start highlighting
  } catch {}
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
      MuiPopover: {
        defaultProps: {
          container: shadowRoot.children['plasmo-shadow-container']
        }
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={styleCache}>
        <Dialog open={selected} onClose={() => setSelect(false)} fullWidth>
          <DialogTitle> New Rule </DialogTitle>
          <DialogContent>
            <SingleRuleEditor site={site} rule={rule} key={rule.pattern} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                openTab<ISitePageArgument>(
                  'site.html',
                  isNew
                    ? {
                        name: site.name,
                        uri_pattern: site.uri_pattern,
                        pattern: rule.pattern
                      }
                    : { id: site.id }
                )
              }>
              More settings
            </Button>
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
