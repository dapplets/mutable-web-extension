import { Mutation } from 'mutable-web-engine'
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
  InfoWrapper,
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
  info,
  mutate,
  starMutationList,
  starMutationListDefault,
  starSelectMutation,
  starSelectMutationDefault,
  trash,
} from '../assets/vectors'
import { ipfs } from '../constants'

import 'simplebar-react/dist/simplebar.min.css'

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  mutations: Mutation[]
  selectedMutation: Mutation | null
  onMutationChange: (mutationId: string | null) => void
  setVisible: (visible: boolean) => void
}

export const Dropdown: FC<DropdownProps> = (props: DropdownProps) => {
  const { selectedMutation, mutations, onMutationChange, setVisible } = props

  const [isSelectedMutation, setIsSelectedMutation] = useState(false)
  const [isAvalible, setAvalible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleMutationClick = (mutationId: string) => {
    setIsOpen(false)
    isOpen ? setVisible(true) : setVisible(false)
    onMutationChange(mutationId)
  }

  // todo: mock
  const changeSelected = () => {
    setIsSelectedMutation(!isSelectedMutation)
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
      // style={{ scrollbarColor: 'rgb(147, 150, 152)  rgb(255, 255, 255)', scrollbarWidth: 'thin' }}
    >
      <SelectedMutationBlock>
        <InfoWrapper>{info}</InfoWrapper>
        <SelectedMutationInfo>
          {selectedMutation && (
            <>
              <SelectedMutationDescription>
                {selectedMutation.metadata.name}
              </SelectedMutationDescription>
              <SelectedMutationId>{selectedMutation.id}</SelectedMutationId>
            </>
          )}
        </SelectedMutationInfo>
        <StarSelectedMutationWrapper onClick={changeSelected}>
          {isSelectedMutation ? starSelectMutation : starSelectMutationDefault}
        </StarSelectedMutationWrapper>
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
              <ButtonBack>{back}to Original</ButtonBack>
              <ButtonMutation>Mutate{mutate}</ButtonMutation>
            </ButtonListBlock>
            <ListMutations>
              {mutations.length &&
                mutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.id === selectedMutation?.id && 'rgba(56, 75, 255, 0.1)'}
                    $enableBefore={mut.id === selectedMutation?.id && '#34d31a'}
                    onClick={() => {
                      onMutationChange(mut.id)
                    }}
                    key={i}
                  >
                    <ImageBlock>
                      {' '}
                      <img src={ipfs + mut.metadata.image.ipfs_cid} />
                    </ImageBlock>
                    <InputInfoWrapper>
                      {/* todo: mocked classname */}
                      <InputMutation
                        className={mut.id === selectedMutation?.id ? 'inputMutationSelected' : ''}
                      >
                        {mut.metadata.name}
                      </InputMutation>
                      {/* todo: mocked classname */}
                      <AuthorMutation
                        className={
                          mut.id === selectedMutation?.id && isSelectedMutation
                            ? 'authorMutationSelected'
                            : ''
                        }
                      >
                        {mut.id}
                      </AuthorMutation>
                    </InputInfoWrapper>
                    {/* todo: mocked */}
                    <InputIconWrapper
                      onClick={(e) => {
                        e.stopPropagation()

                        setVisible(true)
                        setIsOpen(true)
                        {
                          /* todo: mocked */
                        }
                        if (mut.id === selectedMutation?.id && isSelectedMutation) {
                          changeSelected()
                        } else if (mut.id === selectedMutation?.id && !isSelectedMutation) {
                          changeSelected()
                        } else {
                          null
                        }
                      }}
                    >
                      {mut.id === selectedMutation?.id && isSelectedMutation
                        ? starMutationList
                        : mut.id === selectedMutation?.id && !isSelectedMutation
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
                  <AvalibleArrowLable>+266 mutations more</AvalibleArrowLable>
                  {availableIcon}
                </AvalibleArrowBlock>
              </AvalibleLableBlock>
              {/* todo: mock */}
              {isAvalible &&
                mutations.length &&
                mutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.id === selectedMutation?.id && 'rgba(56, 75, 255, 0.1)'}
                    $enableBefore={mut.id === selectedMutation?.id && '#34d31a'}
                    onClick={() => handleMutationClick(mut.id)}
                    key={i}
                    className="avalibleMutationsInput"
                  >
                    <ImageBlock>
                      {' '}
                      <img src={ipfs + mut.metadata.image.ipfs_cid} />
                    </ImageBlock>
                    <InputInfoWrapper>
                      <InputMutation>{mut.metadata.name}</InputMutation>
                      <AuthorMutation>{mut.id}</AuthorMutation>
                    </InputInfoWrapper>
                  </InputBlock>
                ))}
              {isAvalible &&
                mutations.length &&
                mutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.id === selectedMutation?.id && 'rgba(56, 75, 255, 0.1)'}
                    $enableBefore={mut.id === selectedMutation?.id && '#34d31a'}
                    onClick={() => handleMutationClick(mut.id)}
                    key={i}
                    className="avalibleMutationsInput"
                  >
                    <ImageBlock>
                      {' '}
                      <img src={ipfs + mut.metadata.image.ipfs_cid} />
                    </ImageBlock>
                    <InputInfoWrapper>
                      <InputMutation>{mut.metadata.name}</InputMutation>
                      <AuthorMutation>{mut.id}</AuthorMutation>
                    </InputInfoWrapper>
                  </InputBlock>
                ))}
            </AvalibleMutations>{' '}
          </SimpleBar>
        </MutationsList>
      )}
    </WrapperDropdown>
  )
}
