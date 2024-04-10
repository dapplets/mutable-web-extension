import { AppMetadata, Engine, MutationWithSettings } from 'mutable-web-engine'
import { createContext } from 'react'

export type MutableWebContextState = {
  engine: Engine
  mutations: MutationWithSettings[]
  apps: AppMetadata[]
  selectedMutation: MutationWithSettings | null
  isLoading: boolean
  favoriteMutationId: string | null
  stopEngine: () => void
  switchMutation: (mutationId: string) => void
  setFavoriteMutation: (mutationId: string | null) => void
}

export const contextDefaultValues: MutableWebContextState = {
  engine: null as any as Engine, // ToDo
  mutations: [],
  apps: [],
  isLoading: false,
  selectedMutation: null,
  favoriteMutationId: null,
  stopEngine: () => undefined,
  switchMutation: () => undefined,
  setFavoriteMutation: () => undefined,
}

export const MutableWebContext = createContext<MutableWebContextState>(contextDefaultValues)
