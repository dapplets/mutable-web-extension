import React, { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { useMutableWeb } from '../contexts/mutable-web-context'
import { getPanelPinned, removePanelPinned, setPanelPinned } from '../storage'
import { iconPin, iconPinDefault } from './assets/vectors'
import { Dropdown } from './components/dropdown'
import { MutationEditorModal } from './components/mutation-editor-modal'

const WrapperPanel = styled.div<{ $isAnimated?: boolean }>`
  // Global Styles
  font-family: 'Segoe UI', sans-serif;
  * {
    box-sizing: border-box;
  }
  // End Global Styles

  width: 100%;
  right: 0;
  position: fixed;
  z-index: 5000;
  top: 0;
  background: transparent;

  &::before {
    content: '';
    width: 100%;
    height: 5px;
    display: block;
    background: #384bff;
  }

  &:hover,
  &:focus {
    .visible-north-panel {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .visible-default {
    opacity: 1 !important;
    transform: translateY(0);
  }

  .visible-pin {
    opacity: 1 !important;
    transform: translateY(0);
  }
`
const NorthPanel = styled.div<{ $isAnimated?: boolean }>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  width: 318px;
  height: 45px;
  z-index: 5000;
  padding: 4px;
  padding-top: 0;
  border-radius: 0 0 6px 6px;
  background: #384bff;
  box-shadow: 0 4px 5px rgb(45 52 60 / 10%), 0 4px 20px rgb(11 87 111 / 15%);
  opacity: 0;
  transform: translateY(-100%);
  transition: ${(props) =>
    props.$isAnimated ? 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out' : 'initial'};
`

const PinWrapper = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:hover,
  &:focus {
    opacity: 0.5;
  }
`
const DragWrapper = styled.div`
  width: 16px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  border-radius: 2px;
  &:hover,
  &:focus {
    opacity: 0.5;
  }
`

const DragIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 8px;
  height: 8px;
`

const DragIcon = () => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.75" width="8" height="1.5" rx="0.75" fill="white" />
    <rect y="4.25" width="8" height="1.5" rx="0.75" fill="white" />
    <rect y="7.75" width="8" height="1.5" rx="0.75" fill="white" />
  </svg>
)

export const MultitablePanel: FC = () => {
  const { engine, mutations, apps, selectedMutation, switchMutation, stopEngine } = useMutableWeb()
  const [visible, setVisible] = useState(false)
  const [isPin, setPin] = useState(getPanelPinned() ? true : false)
  const [isDragging, setIsDragging] = useState(false)
  const [widgetsName, setWidgetsName] = useState<string | null>(null)
  const [isFavorite, seIsFavorite] = useState<string | null>(
    selectedMutation && selectedMutation.settings.isFavorite ? selectedMutation.id : null
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isPin])

  const handleStartDrag = () => {
    setIsDragging(true)
  }

  const handleStopDrag = () => {
    setIsDragging(false)
  }

  const handleMutationChange = async (mutationId: string) => {
    switchMutation(mutationId)
  }

  const changeSelected = async (mutationId: string) => {
    if (
      selectedMutation &&
      mutationId === selectedMutation.id &&
      selectedMutation.settings.isFavorite
    ) {
      await engine.setFavoriteMutation(null)
      seIsFavorite(null)
      // await init()
    } else if (
      selectedMutation &&
      mutationId === selectedMutation.id &&
      !selectedMutation.settings.isFavorite
    ) {
      await engine.setFavoriteMutation(mutationId)
      seIsFavorite(mutationId)
      // await init()
    } else {
      await engine.removeMutationFromRecents(mutationId)
      // await init()
    }
  }

  const handlePin = () => {
    if (isPin) {
      removePanelPinned()
    } else {
      setPanelPinned('pin')
    }
    setPin(!isPin)
  }

  if (mutations.length === 0) {
    return null
  }
  const handleModalClose = () => {
    setWidgetsName(null)
  }

  const handleResetMutation = async () => {
    seIsFavorite(null)
    stopEngine()
  }

  const sortedMitations = mutations.sort((a, b) => {
    const dateA = a.settings.lastUsage ? new Date(a.settings.lastUsage).getTime() : null
    const dateB = b.settings.lastUsage ? new Date(b.settings.lastUsage).getTime() : null

    if (!dateA) return 1
    if (!dateB) return -1

    return dateB - dateB
  })

  const lastFiveMutations = sortedMitations.slice(0, 5)

  return (
    <WrapperPanel $isAnimated={!isDragging} data-testid="mutable-panel">
      <Draggable
        axis="x"
        bounds="parent"
        handle=".dragWrapper"
        onStart={handleStartDrag}
        onStop={handleStopDrag}
        defaultPosition={{ x: window.innerWidth / 2 - 159, y: 0 }}
      >
        {/* ToDo: refactor className */}
        <NorthPanel
          data-testid="north-panel"
          className={
            isPin
              ? 'visible-pin'
              : visible && !isDragging
              ? 'visible-north-panel'
              : 'visible-default'
          }
          $isAnimated={!isDragging}
        >
          <DragWrapper className="dragWrapper">
            <DragIconWrapper>
              <DragIcon />
            </DragIconWrapper>
          </DragWrapper>
          <Dropdown
            mutations={mutations}
            selectedMutation={selectedMutation}
            onMutationChange={handleMutationChange}
            setVisible={setVisible}
            changeSelected={changeSelected}
            engine={engine}
            setWidgetsName={setWidgetsName}
            isFavorite={isFavorite}
            handleResetMutation={handleResetMutation}
            lastFiveMutations={lastFiveMutations}
          />
          <PinWrapper onClick={handlePin}>{isPin ? iconPin : iconPinDefault}</PinWrapper>
        </NorthPanel>
      </Draggable>
      {widgetsName && (
        <div>
          <MutationEditorModal
            apps={apps}
            baseMutation={selectedMutation}
            onClose={handleModalClose}
          />
        </div>
      )}
    </WrapperPanel>
  )
}

export default MultitablePanel
