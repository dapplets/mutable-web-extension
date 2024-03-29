import { Engine, Mutation } from 'mutable-web-engine'
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import {
  getPanelPinned,
  getPanelPosition,
  removePanelPinned,
  setPanelPinned,
  setPanelPosition,
} from '../storage'
import { iconPin, iconPinDefault } from './assets/vectors'
import { Dropdown } from './components/dropdown'

const WrapperPanel = styled.div`
  width: 100vw;
  right: 0;
  position: fixed;
  z-index: 5000;
  top: 0;
  height: 15px;
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
const NorthPanel = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  margin: 0 auto;

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
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
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
  const [activeDrags, setActiveDrags] = useState(0)
  const [deltaPosition, setDeltaPosition] = useState(
    getPanelPosition() ? { x: parseInt(getPanelPosition()), y: 0 } : { x: 0, y: 0 }
  )
  const refNorthPanel = useRef<HTMLDivElement>(null)
  const [defaultPosition, setdefaultPosition] = useState(
    getPanelPosition() ? { x: parseInt(getPanelPosition()), y: 0 } : { x: 0, y: 0 }
  )

  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 })

  const [mutations, setMutations] = useState<Mutation[]>([])
  const [selectedMutation, setSelectedMutation] = useState<Mutation | null>(null)

  useEffect(() => {
    const init = async () => {
      const mutations = await engine.getMutations()
      setMutations(mutations)

      const mutation = await engine.getCurrentMutation()
      setSelectedMutation(mutation)
    }
    init()
  }, [engine])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isPin])

  const handleDrag = (e, ui) => {
    setDeltaPosition({
      x: deltaPosition.x + ui.deltaX,
      y: deltaPosition.y + ui.deltaY,
    })

    setPanelPosition(deltaPosition.x.toString())
  }

  const onStart = (e) => {
    if (!isPin) {
      document.getElementById('northPanel').style.opacity = '1'
    }

    setActiveDrags(activeDrags + 1)
  }

  const onStop = (e) => {
    setTimeout(() => {
      document.getElementById('northPanel').style.removeProperty('opacity')
    }, 5000)

    setActiveDrags(activeDrags - 1)
  }

  const dragHandlers = {
    onStart,
    onStop,

    defaultPosition,
  }
  const handleMutationChange = async (mutationId: string) => {
    const mutation = mutations.find((mutation) => mutation.id === mutationId)

    setSelectedMutation(mutation)

    await engine.switchMutation(mutation.id)
  }

  const handlePin = () => {
    if (isPin) {
      removePanelPinned()
    } else {
      setPanelPinned('pin')
    }
    setPin(!isPin)
  }

  const updateBounds = () => {
    if (!refNorthPanel.current) return

    const rect = refNorthPanel.current.getBoundingClientRect()
    if (!rect) return

    setBounds({
      left: -((window.innerWidth - rect.width) / 2),
      top: 0,
      right: (window.innerWidth - rect.width) / 2,
      bottom: 0,
    })
  }

  useLayoutEffect(() => {
    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [])

  if (mutations.length === 0) {
    return null
  }

  return (
    <WrapperPanel>
      <div
        style={{
          position: 'relative',
          width: '99%',

          left: '0',
          display: 'flex',
          justifyContent: 'center',
          height: '1px',
          zIndex: 5000,
          margin: '0 10px 0 25px',
        }}
        className="container-drag-north-panel"
      >
        <Draggable
          {...dragHandlers}
          onDrag={handleDrag}
          onStart={onStart}
          onStop={onStop}
          handle=".dragWrapper"
          axis="x"
          bounds={bounds}
        >
          <NorthPanel
            ref={(node) => {
              refNorthPanel.current = node
            }}
            id="northPanel"
            className={isPin ? 'visible-pin' : visible ? 'visible-north-panel' : 'visible-default'}
          >
            <DragWrapper className="dragWrapper">
              <DragIconWrapper>
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
            />
            <PinWrapper onClick={handlePin}>{isPin ? iconPin : iconPinDefault}</PinWrapper>
          </NorthPanel>
        </Draggable>
      </div>
    </WrapperPanel>
  )
}

export default MultitablePanel
