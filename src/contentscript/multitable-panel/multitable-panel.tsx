import { Engine } from 'mutable-web-engine'
import { AppMetadata, MutationWithSettings } from 'mutable-web-engine/dist/providers/provider'
import { Widget } from 'near-social-vm'
import React, { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { getPanelPinned, removePanelPinned, setPanelPinned } from '../storage'
import { iconPin, iconPinDefault } from './assets/vectors'
import { Dropdown } from './components/dropdown'
const WrapperPanel = styled.div<{ $isAnimated?: boolean }>`
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
  box-sizing: border-box;
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

const iconDrag = (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="1.5" viewBox="0 0 6 1" fill="none">
    <rect width="8" height="1.5" rx="0.5" fill="white" />
  </svg>
)

interface MultitablePanelProps {
  engine: Engine
}

export const MultitablePanel: FC<MultitablePanelProps> = ({ engine }) => {
  const [visible, setVisible] = useState(false)
  const [isPin, setPin] = useState(getPanelPinned() ? true : false)
  const [isDragging, setIsDragging] = useState(false)
  const [widgetsName, setWidgetsName] = useState(null)
  const [mutations, setMutations] = useState<MutationWithSettings[]>([])
  const [selectedMutation, setSelectedMutation] = useState<MutationWithSettings | null>(null)
  const [isFavorite, seIsFavorite] = useState<string | null>(
    selectedMutation && selectedMutation.settings.isFavorite ? selectedMutation.id : null
  )
  const [applications, setApplications] = useState<AppMetadata[] | null>(null)
  const [isRevertDisable, setRevertDisable] = useState(true)
  const [isVisibleInputId, setVisibleInputId] = useState(false)
  const [editingMutation, setEditingMutation] = useState<MutationWithSettings | null>(
    JSON.parse(JSON.stringify(selectedMutation))
  )
  const [isSaveDisabled, setSaveDisabled] = useState(false)
  const [saveTooltype, setSaveTooltype] = useState<null | string>(null)
  const [isVisibleInput, setVisibleInput] = useState(false)

  useEffect(() => {
    init()
  }, [engine, isFavorite])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isPin])

  const init = async () => {
    const mutations = await engine.getMutations()
    setMutations(mutations)
    const allApplications = await engine.getApplications()
    setApplications(allApplications)

    const mutation = await engine.getCurrentMutation()
    setSelectedMutation(mutation)
  }
  const handleStartDrag = () => {
    setIsDragging(true)
  }

  const handleStopDrag = () => {
    setIsDragging(false)
  }

  const handleMutationChange = async (mutationId: string) => {
    const mutation = mutations.find((mutation) => mutation.id === mutationId)

    setSelectedMutation(mutation)
    setEditingMutation(mutation)
    await engine.switchMutation(mutation.id)
    window.sessionStorage.setItem('mutableweb:mutationId', mutation.id)
    widgetsName
      ? setWidgetsName(mutation ? mutation.id : 'Some Mutation Name')
      : setWidgetsName(null)
  }

  const changeSelected = async (mutationId: string) => {
    if (mutationId === selectedMutation.id && selectedMutation.settings.isFavorite) {
      await engine.setFavoriteMutation(null)
      seIsFavorite(null)
      await init()
    } else if (mutationId === selectedMutation.id && !selectedMutation.settings.isFavorite) {
      await engine.setFavoriteMutation(mutationId)
      seIsFavorite(mutationId)
      await init()
    } else {
      await engine.removeMutationFromRecents(mutationId)
      await init()
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
    setVisibleInput(false)
    setWidgetsName(null)
  }

  const handleResetMutation = async (setIsOpen?) => {
    setEditingMutation(null)
    setSelectedMutation(null)
    seIsFavorite(null)
    engine.stop()
    window.sessionStorage.setItem('mutableweb:mutationId', null)
  }

  const handleMutationNameChange = (newMutationName: string) => {
    let updatedMutation
    setRevertDisable(false)
    if (!editingMutation) {
      updatedMutation = {
        id: '',
        apps: [],
        targets: [],
        metadata: {
          name: newMutationName,
        },
        settings: {
          isFavorite: false,
          lastUsage: null,
        },
      }
    } else {
      updatedMutation = {
        ...editingMutation,
        metadata: {
          ...editingMutation.metadata,
          name: newMutationName,
        },
      }
    }

    setEditingMutation(updatedMutation)
  }

  const handleRevertChanges = async () => {
    const mutation = await engine.getCurrentMutation()
    setSelectedMutation(mutation)
    setEditingMutation(mutation)
    setRevertDisable(true)
  }

  const handleMutationAppsChange = (newApp) => {
    let updatedMutation
    setRevertDisable(false)
    if (!editingMutation) {
      updatedMutation = {
        id: '',
        apps: [newApp],
        targets: [],
        metadata: {
          name: 'Some Mutation Name',
        },
        settings: {
          isFavorite: false,
          lastUsage: null,
        },
      }
    } else {
      const updatedApps = editingMutation.apps.includes(newApp)
        ? editingMutation.apps.filter((app) => app !== newApp)
        : [...editingMutation.apps, newApp]

      updatedMutation = {
        ...editingMutation,
        apps: updatedApps,
      }
    }
    console.log(updatedMutation)
    setEditingMutation(updatedMutation)
  }

  const handleMutationCreate = async () => {
    try {
      const updatedMutation = {
        ...editingMutation,
        targets: [
          {
            namespace: 'engine',
            contextType: 'website',
            if: {
              id: {
                in: [window.location.hostname],
              },
            },
          },
        ],
      }
      setSelectedMutation(updatedMutation)
      await engine.createMutation(updatedMutation)
    } catch (err) {
      console.log(err)
    } finally {
      setRevertDisable(true)
      setVisibleInput(false)
    }
  }

  const handleMutationEdit = async () => {
    try {
      let updatedMutation = {
        ...editingMutation,
        id: selectedMutation.id,
      }
      await engine.editMutation(updatedMutation)
    } catch (err) {
      console.log(err)
    } finally {
      setRevertDisable(true)
      setVisibleInput(false)
    }
  }

  const handleEditMutationId = (newMutationId: string, loggedInAccountId) => {
    const deleteNonLatin = (text) => {
      return text.replace(/[^A-Za-z]/gi, '')
    }
    let updatedMutation
    setRevertDisable(false)
    setVisibleInputId(true)

    if (!editingMutation) {
      updatedMutation = {
        id: loggedInAccountId + '/' + 'mutation/' + deleteNonLatin(newMutationId),
        apps: [],
        targets: [],
        metadata: {
          name: 'Some Mutation Name',
        },
        settings: {
          isFavorite: false,
          lastUsage: null,
        },
      }
    } else {
      updatedMutation = {
        ...editingMutation,
        id: loggedInAccountId + '/' + 'mutation/' + deleteNonLatin(newMutationId),
      }
    }

    setEditingMutation(updatedMutation)
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
              {/* ToDo: replace with one icon */}
              {iconDrag}
              {iconDrag}
              {iconDrag}
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
          <Widget
            src="bos.dapplets.near/widget/ModalSelectedMutationEditor"
            props={{
              mutationId: editingMutation ? editingMutation.id : null,
              mutationName: editingMutation ? editingMutation.metadata.name : widgetsName,
              allApps: applications,
              selectedApps: editingMutation ? editingMutation.apps : null,
              selectedMutation: selectedMutation ? selectedMutation : null,
              onClose: handleModalClose,
              onMutationReset: handleRevertChanges,
              onMutationNameChange: handleMutationNameChange,
              onMutationAppsChange: handleMutationAppsChange,
              onMutationCreate: handleMutationCreate,
              onMutationEdit: handleMutationEdit,
              onMutationIdChange: handleEditMutationId,
              isRevertDisable: isRevertDisable,
              isVisibleInputId: isVisibleInputId,
              setVisibleInputId: setVisibleInputId,
              editingMutation: editingMutation ? editingMutation : null,
              isSaveDisabled: isSaveDisabled,
              saveTooltype: saveTooltype,
              setSaveDisabled: setSaveDisabled,
              setSaveTooltype: setSaveTooltype,
              isVisibleInput: isVisibleInput,
              setVisibleInput: setVisibleInput,
            }}
          />
        </div>
      )}
    </WrapperPanel>
  )
}

export default MultitablePanel
