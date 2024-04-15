declare let EXTENSION_VERSION: string
declare let NEAR_NETWORK: 'mainnet' | 'testnet'

declare module 'near-social-vm' {
  export function useAccountId(): string | null
  export function useInitNear(): { initNear: (config: any) => void }
}

declare module 'chrome-extension-message-wrapper'
