import { AppMetadata, Engine, MutationWithSettings } from 'mutable-web-engine'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { MutableWebContext, MutableWebContextState } from './mutable-web-context'

type Props = {
  engine: Engine
  children: ReactElement
}

const MutableWebProvider: FC<Props> = ({ children, engine }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMutation, setSelectedMutation] = useState<MutationWithSettings | null>(null)
  const [mutations, setMutations] = useState<MutationWithSettings[]>([])
  const [apps, setApps] = useState<AppMetadata[]>([])

  const loadMutations = async (engine: Engine) => {
    const mutations = await engine.getMutations()
    setMutations(mutations)

    const allApps = await engine.getApplications()
    setApps(allApps)

    const mutation = await engine.getCurrentMutation()
    setSelectedMutation(mutation)
  }

  useEffect(() => {
    loadMutations(engine)
  }, [engine])

  const stopEngine = () => {
    setSelectedMutation(null)
    engine.stop()
    window.sessionStorage.setItem('mutableweb:mutationId', '')
  }

  const switchMutation = async (mutationId: string) => {
    const mutation = mutations.find((mutation) => mutation.id === mutationId)

    if (!mutation) {
      throw new Error(`Mutation with this ID is not found: ${mutationId}`)
    }

    setSelectedMutation(mutation)

    try {
      setIsLoading(true)

      if (engine.started) {
        await engine.switchMutation(mutation.id)
      } else {
        await engine.start(mutation.id)
      }
    } catch (err) {
      console.error(err)
      // ToDo: save previous mutation and switch back if failed
    } finally {
      setIsLoading(false)
    }

    window.sessionStorage.setItem('mutableweb:mutationId', mutation.id)
  }

  const state: MutableWebContextState = {
    engine,
    mutations,
    apps,
    selectedMutation,
    isLoading,
    stopEngine,
    switchMutation,
  }

  return <MutableWebContext.Provider value={state}>{children}</MutableWebContext.Provider>
}

export { MutableWebProvider }
