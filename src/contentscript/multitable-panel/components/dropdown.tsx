import { Engine, Mutation } from 'mutable-web-engine'
import React, { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { setCurrentMutationId } from '../../storage'
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
  engine: Engine
  setVisible: (visible: boolean) => void
}

export const Dropdown: FC<DropdownProps> = (props: DropdownProps) => {
  const { engine, setVisible } = props
  const [isOpen, setOpen] = useState(false)
  const [selectedMutation, setSelectedMutation] = useState<Mutation | null>(null)

  const [mutations, setMutations] = useState<Mutation[]>([])
  // todo: mock
  const [isSelectedMutation, setIsSelectedMutation] = useState(false)
  // todo: mock
  const [isAvalible, setAvalible] = useState(false)

  useEffect(() => {
    const init = async () => {
      const mutations = await engine.getMutations()
      setMutations(mutations)

      const mutation = await engine.getCurrentMutation()
      setSelectedMutation(mutation)
    }
    init()
  }, [engine])

  const enableMutation = async (mut: Mutation) => {
    setSelectedMutation(mut)
    setOpen(false) // ToDo: ???

    isOpen ? setVisible(true) : setVisible(false)

    await engine.switchMutation(mut.id)
    setCurrentMutationId(mut.id)
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
      //   setOpen(false)
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

              setOpen(!isOpen)
            }}
          >
            {iconDropdown}
          </OpenList>
        ) : (
          <OpenListDefault
            onClick={() => {
              isOpen ? setVisible(true) : setVisible(false)

              setOpen(!isOpen)
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
                      enableMutation(mut)
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
                        setOpen(true)
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
                    onClick={() => {
                      enableMutation(mut)
                    }}
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
                    onClick={() => {
                      enableMutation(mut)
                    }}
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
