import { AppMetadata, Engine, MutationWithSettings } from 'mutable-web-engine'
import { createContext } from 'react'

export type MutableWebContextState = {
  engine: Engine
  mutations: MutationWithSettings[]
  apps: AppMetadata[]
  selectedMutation: MutationWithSettings | null
  isLoading: boolean
  stopEngine: () => void
  switchMutation: (mutationId: string) => void
}

export const contextDefaultValues: MutableWebContextState = {
  engine: null as any as Engine, // ToDo
  mutations: [],
  apps: [],
  isLoading: false,
  selectedMutation: null,
  stopEngine: () => undefined,
  switchMutation: () => undefined,
}

export const MutableWebContext = createContext<MutableWebContextState>(contextDefaultValues)
