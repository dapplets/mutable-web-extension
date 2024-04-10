import { Engine } from 'mutable-web-engine'
import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react'
import SimpleBar from 'simplebar-react'
import {
  AuthorMutation,
  AvalibleArrowBlock,
  AvalibleArrowLable,
  AvalibleLable,
  AvalibleLableBlock,
  AvalibleMutations,
  ButtonBack,
  ButtonListBlock,
  ButtonMutation,
  ImageBlock,
  InputBlock,
  InputIconWrapper,
  InputInfoWrapper,
  InputMutation,
  ListMutations,
  MutationsList,
  OpenList,
  OpenListDefault,
  SelectedMutationBlock,
  SelectedMutationDescription,
  SelectedMutationId,
  SelectedMutationInfo,
  StarSelectedMutationWrapper,
  WrapperDropdown,
} from '../assets/stylesDropdown'
import {
  availableIcon,
  back,
  iconDropdown,
  mutate,
  starMutationList,
  starMutationListDefault,
  starSelectMutation,
  starSelectMutationDefault,
  trash,
} from '../assets/vectors'
import { ipfs } from '../constants'

import { MutationWithSettings } from 'mutable-web-engine/dist/providers/provider'
import 'simplebar-react/dist/simplebar.min.css'

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  mutations: MutationWithSettings[]
  selectedMutation: MutationWithSettings | null
  onMutationChange: (mutationId: string) => void
  setVisible: (visible: boolean) => void
  changeSelected: (mutationId: string, isFavorite: string | null) => void
  engine: Engine
  setWidgetsName: (x: string | null) => void
  isFavorite: string | null
  handleResetMutation: () => void
  lastFiveMutations: MutationWithSettings[]
}

export const Dropdown: FC<DropdownProps> = (props: DropdownProps) => {
  const {
    selectedMutation,
    mutations,
    onMutationChange,
    setVisible,
    changeSelected,
    setWidgetsName,
    isFavorite,
    handleResetMutation,
    lastFiveMutations,
  } = props

  const [isAvalible, setAvalible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleMutationClick = (mutationId: string) => {
    setIsOpen(false)
    isOpen ? setVisible(true) : setVisible(false)
    onMutationChange(mutationId)
  }

  // todo: mock
  const changeAvalibleMutations = () => {
    setAvalible(!isAvalible)
  }

  return (
    <WrapperDropdown
      // onBlur={() => {
      //   setVisible(false)
      //   setIsOpen(false)
      // }}
      tabIndex={0}
    >
      <SelectedMutationBlock
        onClick={() => {
          isOpen ? setVisible(true) : setVisible(false)
          setIsOpen(!isOpen)
        }}
        data-testid="selected-mutation-block"
      >
        <SelectedMutationInfo>
          {selectedMutation && selectedMutation.metadata ? (
            <>
              <SelectedMutationDescription>
                {selectedMutation.metadata.name}
              </SelectedMutationDescription>
              <SelectedMutationId>{selectedMutation.id}</SelectedMutationId>
            </>
          ) : (
            <>
              <SelectedMutationDescription>No mutations applied</SelectedMutationDescription>
            </>
          )}
        </SelectedMutationInfo>
        {selectedMutation ? (
          <StarSelectedMutationWrapper
            onClick={() => changeSelected(selectedMutation.id, isFavorite)}
          >
            {selectedMutation && selectedMutation.settings.isFavorite
              ? starSelectMutation
              : starSelectMutationDefault}
          </StarSelectedMutationWrapper>
        ) : null}

        {isOpen ? (
          <OpenList
            onClick={() => {
              isOpen ? setVisible(true) : setVisible(false)
              setIsOpen(!isOpen)
            }}
          >
            {iconDropdown}
          </OpenList>
        ) : (
          <OpenListDefault
            onClick={() => {
              isOpen ? setVisible(true) : setVisible(false)
              setIsOpen(!isOpen)
            }}
          >
            {iconDropdown}
          </OpenListDefault>
        )}
      </SelectedMutationBlock>

      {isOpen && (
        <MutationsList>
          {' '}
          <SimpleBar style={{ maxHeight: 500, overflowX: 'hidden' }}>
            <ButtonListBlock>
              <ButtonBack onClick={handleResetMutation}>{back}to Original</ButtonBack>
              <ButtonMutation
                onClick={() => {
                  setIsOpen(!isOpen)
                  setWidgetsName(selectedMutation ? selectedMutation.id : 'Some Mutation Name')
                }}
              >
                Mutate{mutate}
              </ButtonMutation>
            </ButtonListBlock>
            <ListMutations>
              {lastFiveMutations.length &&
                lastFiveMutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.settings.isFavorite ? 'rgba(56, 75, 255, 0.1)' : ''}
                    $enableBefore={mut.settings.isFavorite ? '#34d31a' : ''}
                    key={i}
                  >
                    <ImageBlock>
                      {' '}
                      <img
                        src={
                          mut.metadata && mut.metadata.image && mut.metadata.image.ipfs_cid
                            ? ipfs + mut.metadata.image.ipfs_cid
                            : undefined
                        }
                      />
                    </ImageBlock>
                    <InputInfoWrapper
                      onClick={() => {
                        onMutationChange(mut.id)
                      }}
                    >
                      {/* todo: mocked classname */}
                      <InputMutation
                        className={mut.id === selectedMutation?.id ? 'inputMutationSelected' : ''}
                      >
                        {mut.metadata ? mut.metadata.name : ''}
                      </InputMutation>
                      {/* todo: mocked classname */}
                      <AuthorMutation
                        className={
                          mut.id === selectedMutation?.id && mut.id === isFavorite
                            ? 'authorMutationSelected'
                            : ''
                        }
                      >
                        {mut.id}
                      </AuthorMutation>
                    </InputInfoWrapper>
                    {/* todo: mocked */}
                    <InputIconWrapper onClick={() => changeSelected(mut.id, isFavorite)}>
                      {mut.settings.isFavorite
                        ? starMutationList
                        : mut.id === selectedMutation?.id
                        ? starMutationListDefault
                        : trash}
                    </InputIconWrapper>
                  </InputBlock>
                ))}
            </ListMutations>
            <AvalibleMutations>
              <AvalibleLableBlock>
                <AvalibleLable>available</AvalibleLable>
                {/* todo: mock */}
                <AvalibleArrowBlock
                  className={isAvalible ? 'iconRotate' : ''}
                  onClick={changeAvalibleMutations}
                >
                  <AvalibleArrowLable>{mutations.length} mutations</AvalibleArrowLable>
                  {availableIcon}
                </AvalibleArrowBlock>
              </AvalibleLableBlock>

              {isAvalible &&
                mutations.length &&
                mutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.id === selectedMutation?.id ? 'rgba(56, 75, 255, 0.1)' : ''}
                    $enableBefore={mut.id === selectedMutation?.id ? '#34d31a' : ''}
                    onClick={() => handleMutationClick(mut.id)}
                    key={i}
                    className="avalibleMutationsInput"
                  >
                    <ImageBlock>
                      <img
                        src={
                          mut.metadata && mut.metadata.image && mut.metadata.image.ipfs_cid
                            ? ipfs + mut.metadata.image.ipfs_cid
                            : undefined
                        }
                      />
                    </ImageBlock>
                    <InputInfoWrapper>
                      <InputMutation>{mut.metadata ? mut.metadata.name : ''}</InputMutation>
                      <AuthorMutation>{mut.id}</AuthorMutation>
                    </InputInfoWrapper>
                  </InputBlock>
                ))}
            </AvalibleMutations>
          </SimpleBar>
        </MutationsList>
      )}
    </WrapperDropdown>
  )
}
