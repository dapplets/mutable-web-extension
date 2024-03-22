import { Engine } from 'mutable-web-engine'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getPanelPinned, removePanelPinned, setPanelPinned } from '../storage'
import { Dropdown } from './components/dropdown'
import { iconPin, iconPinDefault } from './assets/vectors'
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
    opacity: 1;
    transform: translateY(0);
  }
  .visible-pin {
    opacity: 1 !important;
    transform: translateY(0) !important;
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

  width: 294px;
  height: 45px;

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

interface MultitablePanelProps {
  engine: Engine
}

export const MultitablePanel: FC<MultitablePanelProps> = (props) => {
  const [visible, setVisible] = useState(false)
  const [isPin, setPin] = useState(getPanelPinned() ? true : false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isPin, visible])

  const handlePin = () => {
    if (isPin) {
      removePanelPinned()
    } else {
      setPanelPinned('pin')
    }
    setPin(!isPin)
  }

  return (
    <WrapperPanel>
      <NorthPanel
        className={isPin ? 'visible-pin' : visible ? 'visible-north-panel' : 'visible-default'}
      >
        <Dropdown setVisible={setVisible} engine={props.engine} />
        <PinWrapper onClick={handlePin}>{isPin ? iconPin : iconPinDefault}</PinWrapper>
      </NorthPanel>
    </WrapperPanel>
  )
}

export default MultitablePanel
