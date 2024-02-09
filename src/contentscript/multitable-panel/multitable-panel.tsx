import { Engine } from 'mutable-web-engine'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { Dropdown } from './components/dropdown'

const WrapperPanel = styled.div<{ $right: string; $width: string }>`
  width: ${(props) => props.$width};
  right: ${(props) => props.$right};
  position: fixed;
  z-index: 1009;
  top: 0;
  height: 5px;
  background: #3d7fff;
`
const NorthPanel = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 0 auto;

  width: 228px;
  height: 45px;

  padding: 4px;

  border-radius: 0 0 6px 6px;
  background: #3d7fff;
  box-sizing: border-box;
  box-shadow: 0 4px 5px rgb(45 52 60 / 10%), 0 4px 20px rgb(11 87 111 / 15%);
`
interface MultitablePanelProps {
  engine: Engine
}

export const MultitablePanel: FC<MultitablePanelProps> = (props) => {
  useEffect(() => {}, [window.innerWidth])

  return (
    <WrapperPanel
      $right={`${
        !document
          .querySelector('#dapplets-overlay-manager')
          ?.classList.contains('dapplets-overlay-collapsed')
          ? 0
          : 468
      }px`}
      $width={`${window.innerWidth}px`}
    >
      <NorthPanel>
        <Dropdown engine={props.engine} />
      </NorthPanel>
    </WrapperPanel>
  )
}
