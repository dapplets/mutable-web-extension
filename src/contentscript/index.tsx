import { setupWalletSelector } from '@near-wallet-selector/core'
import { Engine, Overlay } from 'mutable-web-engine'
import { useInitNear } from 'near-social-vm'
import React, { FC, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import browser from 'webextension-polyfill'
import { ExtensionStorage } from './extension-storage'
import { MultitablePanel } from './multitable-panel/multitable-panel'
import { setupWallet } from './wallet'

const NetworkId = 'mainnet'
const DefaultContractId = 'social.near' // ToDo: Another contract will be rejected by near-social-vm. It will sign out the user

// The wallet selector looks like an unnecessary abstraction layer over the background wallet
// but we have to use it because near-social-vm uses not only a wallet object, but also a selector state
// object and its Observable for event subscription
const selectorPromise = setupWalletSelector({
  network: NetworkId,
  // The storage is faked because it's not necessary. The selected wallet ID is hardcoded below
  storage: new ExtensionStorage(),
  modules: [
    setupWallet({
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://app.mynearwallet.com',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.near.org',
    }),
  ],
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
        networkId: NetworkId,
        selector: selectorPromise,
        features: {
          skipTxConfirmationPopup: true,
        },
        customElements: {
          DappletOverlay: ({ children }: { children: React.ReactNode[] }) => {
            const child = children.filter((c) => typeof c !== 'string' || !!c.trim())[0]
            return <Overlay>{child}</Overlay>
          },
        },
      })
    }
  }, [initNear])

  return null
}

async function main() {
  // Execute useInitNear hook before start the engine
  // It's necessary for widgets from near-social-vm
  createRoot(document.createElement('div')).render(<App />)

  const selector = await selectorPromise

  const engine = new Engine({
    networkId: NetworkId,
    selector,
  })

  await engine.start()

  browser.runtime.onMessage.addListener((message) => {
    if (!message || !message.type) return

    if (message.type === 'PING') {
      // Used for background. When user clicks on the extension icon, content script may be not injected.
      // It's a way to check liveness of the content script
      return Promise.resolve('PONG')
    } else if (message.type === 'OPEN_POPUP') {
      selectorPromise.then((selector) => {
        selector.wallet().then((wallet) => {
          wallet.signIn({
            contractId: DefaultContractId,
            accounts: [],
          })
        })
      })
    }
  })

  const container = document.createElement('div')
  container.style.display = 'flex'
  document.body.appendChild(container)

  const root = createRoot(container)

  root.render(<MultitablePanel engine={engine} />)
}

main().catch(console.error)
