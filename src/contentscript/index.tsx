import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core'
import { initBGFunctions } from 'chrome-extension-message-wrapper'
import { EventEmitter as NEventEmitter } from 'events'
import { DappletOverlay, Engine } from 'mutable-web-engine'
import { useInitNear } from 'near-social-vm'
import React, { FC, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import browser from 'webextension-polyfill'
import { BgFunctions } from '../background'
import { networkConfig } from '../common/networks'
import { ExtensionStorage } from './extension-storage'
import { MultitablePanel } from './multitable-panel/multitable-panel'
import { getCurrentMutationId, setCurrentMutationId } from './storage'
import { setupWallet } from './wallet'

const eventEmitter = new NEventEmitter()

// The wallet selector looks like an unnecessary abstraction layer over the background wallet
// but we have to use it because near-social-vm uses not only a wallet object, but also a selector state
// object and its Observable for event subscription
const selectorPromise = setupWalletSelector({
  network: networkConfig.networkId as NetworkId,
  // The storage is faked because it's not necessary. The selected wallet ID is hardcoded below
  storage: new ExtensionStorage(),
  modules: [setupWallet({ eventEmitter })],
}).then((selector) => {
  // Use background wallet by default
  const wallet = selector.wallet
  selector.wallet = () => wallet('background')
  return selector
})

const App: FC = () => {
  const { initNear } = useInitNear()

  useEffect(() => {
    if (initNear) {
      initNear({
        networkId: networkConfig.networkId,
        selector: selectorPromise,
        features: {
          skipTxConfirmationPopup: true,
        },
        customElements: { DappletOverlay },
      })
    }
  }, [initNear])

  return null
}

async function main() {
  // Execute useInitNear hook before start the engine
  // It's necessary for widgets from near-social-vm
  createRoot(document.createElement('div')).render(<App />)

  const tabState = await initBGFunctions(browser).then((x: BgFunctions) => x.popTabState())

  if (tabState?.mutationId) {
    setCurrentMutationId(tabState?.mutationId)
  }

  const selector = await selectorPromise

  const engine = new Engine({
    networkId: networkConfig.networkId,
    gatewayId: 'mutable-web-extension',
    selector,
  })

  const mutationId = getCurrentMutationId()

  console.log('Mutable Web Engine is initializing...')

  if (mutationId) {
    try {
      await engine.start(mutationId)
    } catch (err) {
      console.error(err)
      await engine.start()
    }
  } else {
    await engine.start()
  }

  await selector.wallet()

  browser.runtime.onMessage.addListener((message) => {
    if (!message || !message.type) return
    if (message.type === 'PING') {
      // Used for background. When user clicks on the extension icon, content script may be not injected.
      // It's a way to check liveness of the content script
      return Promise.resolve('PONG')
    } else if (message.type === 'COPY') {
      navigator.clipboard.writeText(message.address)
    } else if (message.type === 'SIGNED_IN') {
      eventEmitter.emit('signedIn', message.params)
    } else if (message.type === 'SIGNED_OUT') {
      eventEmitter.emit('signedOut')
    }
  })

  const container = document.createElement('div')
  container.style.display = 'flex'
  document.body.appendChild(container)
  const root = createRoot(container)
  root.render(<MultitablePanel engine={engine} />)

  return engine
}

main().catch(console.error)
