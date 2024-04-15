<<<<<<< HEAD
import { Engine } from 'mutable-web-engine'
import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react'
import SimpleBar from 'simplebar-react'
=======
import React, { DetailedHTMLProps, FC, HTMLAttributes, useMemo, useState } from 'react'
>>>>>>> main
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
<<<<<<< HEAD
  InfoWrapper,
=======
>>>>>>> main
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
<<<<<<< HEAD
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

import { MutationWithSettings } from 'mutable-web-engine/dist/providers/provider'
import 'simplebar-react/dist/simplebar.min.css'

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  mutations: MutationWithSettings[]
  selectedMutation: MutationWithSettings | null
  onMutationChange: (mutationId: string | null) => void
  setVisible: (visible: boolean) => void
  changeSelected: (mutationId: string, isFavorite: string | null) => void
  engine: Engine
  setWidgetsName: (x) => void
  isFavorite: string | null
  handleResetMutation: (x) => void
}

export const Dropdown: FC<DropdownProps> = (props: DropdownProps) => {
  const {
    selectedMutation,
    mutations,
    onMutationChange,
    setVisible,
    changeSelected,
    engine,
    setWidgetsName,
    isFavorite,
    handleResetMutation,
  } = props

  const [isAvalible, setAvalible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
=======
  AvailableIcon,
  Back,
  IconDropdown,
  Mutate,
  StarMutationList,
  StarMutationListDefault,
  StarSelectMutation,
  StarSelectMutationDefault,
  Trash,
} from '../assets/vectors'

import { MutationWithSettings } from 'mutable-web-engine/dist/providers/provider'
import { useMutableWeb } from '../../contexts/mutable-web-context'
import { Image } from './image'

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
  onMutateButtonClick: () => void
}

export const Dropdown: FC<DropdownProps> = ({
  isVisible,
  onVisibilityChange,
  onMutateButtonClick,
}: DropdownProps) => {
  const {
    mutations,
    selectedMutation,
    favoriteMutationId,
    setFavoriteMutation,
    switchMutation,
    stopEngine,
    removeMutationFromRecents,
  } = useMutableWeb()

  const recentlyUsedMutations = useMemo(
    () =>
      mutations
        .filter((mut) => mut.settings.lastUsage)
        .sort((a, b) => {
          const dateA = a.settings.lastUsage ? new Date(a.settings.lastUsage).getTime() : null
          const dateB = b.settings.lastUsage ? new Date(b.settings.lastUsage).getTime() : null

          if (!dateA) return 1
          if (!dateB) return -1

          return dateB - dateB
        }),
    [mutations]
  )

  const [isAccordeonExpanded, setIsAccordeonExpanded] = useState(recentlyUsedMutations.length === 0)

  const unusedMutations = useMemo(
    () => mutations.filter((mut) => !mut.settings.lastUsage),
    [mutations]
  )
>>>>>>> main

  const handleMutationClick = (mutationId: string) => {
    onVisibilityChange(false)
    switchMutation(mutationId)
  }

  // todo: mock
  const handleAccordeonClick = () => {
    setIsAccordeonExpanded((val) => !val)
  }

  const handleMutateButtonClick = () => {
    onVisibilityChange(false)
    onMutateButtonClick()
  }

  const handleFavoriteButtonClick = (mutation: MutationWithSettings) => {
    setFavoriteMutation(mutation.id === favoriteMutationId ? null : mutation.id)
  }

  const handleOriginalButtonClick = async () => {
    onVisibilityChange(false)
    stopEngine()
  }

  const handleRemoveFromRecentlyUsedClick = async (mut: MutationWithSettings) => {
    removeMutationFromRecents(mut.id)
  }

  // todo: mock
  const changeAvalibleMutations = () => {
    setAvalible(!isAvalible)
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
<<<<<<< HEAD
    <WrapperDropdown
      // onBlur={() => {
      //   setVisible(false)
      //   setIsOpen(false)
      // }}
      tabIndex={0}
    >
      <SelectedMutationBlock data-testid="selected-mutation-block">
        <InfoWrapper>{info}</InfoWrapper>
=======
    <WrapperDropdown>
      <SelectedMutationBlock
        onClick={() => onVisibilityChange(!isVisible)}
        data-testid="selected-mutation-block"
      >
>>>>>>> main
        <SelectedMutationInfo>
          {selectedMutation && selectedMutation.metadata ? (
            <>
              <SelectedMutationDescription>
                {selectedMutation.metadata.name}
              </SelectedMutationDescription>
              <SelectedMutationId>{selectedMutation.id}</SelectedMutationId>
            </>
          ) : (
            <SelectedMutationDescription>No mutations applied</SelectedMutationDescription>
          )}
        </SelectedMutationInfo>
<<<<<<< HEAD
        <StarSelectedMutationWrapper
          onClick={() => changeSelected(selectedMutation.id, isFavorite)}
        >
          {selectedMutation && selectedMutation.settings.isFavorite
            ? starSelectMutation
            : starSelectMutationDefault}
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
=======

        {selectedMutation ? (
          <StarSelectedMutationWrapper onClick={() => handleFavoriteButtonClick(selectedMutation)}>
            {selectedMutation.id === favoriteMutationId ? (
              <StarSelectMutation />
            ) : (
              <StarSelectMutationDefault />
            )}
          </StarSelectedMutationWrapper>
        ) : null}

        {isVisible ? (
          <OpenList onClick={() => onVisibilityChange(!isVisible)}>
            <IconDropdown />
          </OpenList>
        ) : (
          <OpenListDefault onClick={() => onVisibilityChange(!isVisible)}>
            <IconDropdown />
>>>>>>> main
          </OpenListDefault>
        )}
      </SelectedMutationBlock>

      {isVisible && (
        <MutationsList>
<<<<<<< HEAD
          {' '}
          <SimpleBar style={{ maxHeight: 500, overflowX: 'hidden' }}>
            <ButtonListBlock>
              <ButtonBack onClick={() => handleResetMutation(setIsOpen)}>
                {back}to Original
              </ButtonBack>
              <ButtonMutation
                onClick={() => {
                  setIsOpen(!isOpen)
                  setWidgetsName(selectedMutation.id)
                }}
              >
                Mutate{mutate}
              </ButtonMutation>
            </ButtonListBlock>
            <ListMutations>
              {lastFiveMutations.length &&
                lastFiveMutations.map((mut, i) => (
                  <InputBlock
                    $enable={mut.settings.isFavorite && 'rgba(56, 75, 255, 0.1)'}
                    $enableBefore={mut.settings.isFavorite && '#34d31a'}
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
                          mut.id === selectedMutation?.id && mut.id === isFavorite
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
                        changeSelected(mut.id, isFavorite)
                      }}
                    >
                      {mut.settings.isFavorite
                        ? starMutationList
                        : mut.id === selectedMutation?.id
                        ? starMutationListDefault
                        : trash}
                    </InputIconWrapper>
                  </InputBlock>
                ))}
            </ListMutations>
=======
          {/* <SimpleBar style={{ maxHeight: 500, overflowX: 'hidden' }}> */}
          <ButtonListBlock>
            <ButtonBack onClick={handleOriginalButtonClick}>{<Back />} to Original</ButtonBack>
            <ButtonMutation onClick={handleMutateButtonClick}>Mutate {<Mutate />}</ButtonMutation>
          </ButtonListBlock>

          {recentlyUsedMutations.length > 0 ? (
            <ListMutations>
              {recentlyUsedMutations.map((mut) => (
                <InputBlock key={mut.id} isActive={mut.id === selectedMutation?.id}>
                  <ImageBlock>
                    <Image image={mut.metadata.image} />
                  </ImageBlock>
                  <InputInfoWrapper onClick={() => handleMutationClick(mut.id)}>
                    {/* todo: mocked classname */}
                    <InputMutation
                      className={mut.id === selectedMutation?.id ? 'inputMutationSelected' : ''}
                    >
                      {mut.metadata ? mut.metadata.name : ''}
                    </InputMutation>
                    {/* todo: mocked classname */}
                    <AuthorMutation
                      className={
                        mut.id === selectedMutation?.id && mut.id === favoriteMutationId
                          ? 'authorMutationSelected'
                          : ''
                      }
                    >
                      {mut.id}
                    </AuthorMutation>
                  </InputInfoWrapper>
                  {/* todo: mocked */}

                  {mut.id === favoriteMutationId ? (
                    <InputIconWrapper onClick={() => handleFavoriteButtonClick(mut)}>
                      <StarMutationList />
                    </InputIconWrapper>
                  ) : mut.id === selectedMutation?.id ? (
                    <InputIconWrapper onClick={() => handleFavoriteButtonClick(mut)}>
                      <StarMutationListDefault />
                    </InputIconWrapper>
                  ) : (
                    <InputIconWrapper onClick={() => handleRemoveFromRecentlyUsedClick(mut)}>
                      <Trash />
                    </InputIconWrapper>
                  )}
                </InputBlock>
              ))}
            </ListMutations>
          ) : null}

          {unusedMutations.length > 0 ? (
>>>>>>> main
            <AvalibleMutations>
              <AvalibleLableBlock>
                <AvalibleLable>available</AvalibleLable>
                {/* todo: mock */}
                <AvalibleArrowBlock
<<<<<<< HEAD
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
                    $enable={mut.id === selectedMutation?.id && 'rgba(56, 75, 255, 0.1)'}
                    $enableBefore={mut.id === selectedMutation?.id && '#34d31a'}
                    onClick={() => handleMutationClick(mut.id)}
                    key={i}
                    className="avalibleMutationsInput"
                  >
                    <ImageBlock>
                      <img src={ipfs + mut.metadata.image.ipfs_cid} />
                    </ImageBlock>
                    <InputInfoWrapper>
                      <InputMutation>{mut.metadata.name}</InputMutation>
                      <AuthorMutation>{mut.id}</AuthorMutation>
                    </InputInfoWrapper>
                  </InputBlock>
                ))}
            </AvalibleMutations>
          </SimpleBar>
=======
                  className={isAccordeonExpanded ? 'iconRotate' : ''}
                  onClick={handleAccordeonClick}
                >
                  <AvalibleArrowLable>{unusedMutations.length} mutations</AvalibleArrowLable>
                  <AvailableIcon />
                </AvalibleArrowBlock>
              </AvalibleLableBlock>

              {isAccordeonExpanded
                ? unusedMutations.map((mut) => (
                    <InputBlock
                      key={mut.id}
                      isActive={mut.id === selectedMutation?.id}
                      onClick={() => handleMutationClick(mut.id)}
                      className="avalibleMutationsInput"
                    >
                      <ImageBlock>
                        <Image image={mut.metadata.image} />
                      </ImageBlock>
                      <InputInfoWrapper>
                        <InputMutation>{mut.metadata ? mut.metadata.name : ''}</InputMutation>
                        <AuthorMutation>{mut.id}</AuthorMutation>
                      </InputInfoWrapper>
                    </InputBlock>
                  ))
                : null}
              {isAccordeonExpanded
                ? unusedMutations.map((mut) => (
                    <InputBlock
                      key={mut.id}
                      isActive={mut.id === selectedMutation?.id}
                      onClick={() => handleMutationClick(mut.id)}
                      className="avalibleMutationsInput"
                    >
                      <ImageBlock>
                        <Image image={mut.metadata.image} />
                      </ImageBlock>
                      <InputInfoWrapper>
                        <InputMutation>{mut.metadata ? mut.metadata.name : ''}</InputMutation>
                        <AuthorMutation>{mut.id}</AuthorMutation>
                      </InputInfoWrapper>
                    </InputBlock>
                  ))
                : null}
            </AvalibleMutations>
          ) : null}
          {/* </SimpleBar> */}
>>>>>>> main
        </MutationsList>
      )}
    </WrapperDropdown>
  )
}
