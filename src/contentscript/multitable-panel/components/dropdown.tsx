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
import { useMutableWeb } from '../../contexts/mutable-web-context'

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  isVisible: boolean
  lastFiveMutations: MutationWithSettings[]
  onVisibilityChange: (visible: boolean) => void
  onMutationChange: (mutationId: string) => void
  onMutateButtonClick: () => void
  onOriginalButtonClick: () => void
}

export const Dropdown: FC<DropdownProps> = ({
  isVisible,
  lastFiveMutations,
  onVisibilityChange,
  onMutationChange,
  onMutateButtonClick,
  onOriginalButtonClick,
}: DropdownProps) => {
  const { mutations, selectedMutation, favoriteMutationId, setFavoriteMutation } = useMutableWeb()

  const [isAccordeonExpanded, setIsAccordeonExpanded] = useState(false)

  const handleMutationClick = (mutationId: string) => {
    onVisibilityChange(false)
    onMutationChange(mutationId)
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

  return (
    <WrapperDropdown>
      <SelectedMutationBlock
        onClick={() => onVisibilityChange(!isVisible)}
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
            <SelectedMutationDescription>No mutations applied</SelectedMutationDescription>
          )}
        </SelectedMutationInfo>

        {selectedMutation ? (
          <StarSelectedMutationWrapper onClick={() => handleFavoriteButtonClick(selectedMutation)}>
            {selectedMutation.id === favoriteMutationId
              ? starSelectMutation
              : starSelectMutationDefault}
          </StarSelectedMutationWrapper>
        ) : null}

        {isVisible ? (
          <OpenList onClick={() => onVisibilityChange(!isVisible)}>{iconDropdown}</OpenList>
        ) : (
          <OpenListDefault onClick={() => onVisibilityChange(!isVisible)}>
            {iconDropdown}
          </OpenListDefault>
        )}
      </SelectedMutationBlock>

      {isVisible && (
        <MutationsList>
          {' '}
          <SimpleBar style={{ maxHeight: 500, overflowX: 'hidden' }}>
            <ButtonListBlock>
              <ButtonBack onClick={onOriginalButtonClick}>{back}to Original</ButtonBack>
              <ButtonMutation onClick={handleMutateButtonClick}>Mutate{mutate}</ButtonMutation>
            </ButtonListBlock>
            <ListMutations>
              {lastFiveMutations.map((mut) => (
                <InputBlock key={mut.id} isActive={mut.id === selectedMutation?.id}>
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
                  <InputInfoWrapper onClick={() => onMutationChange(mut.id)}>
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
                  <InputIconWrapper onClick={() => handleFavoriteButtonClick(mut)}>
                    {mut.id === favoriteMutationId
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
                  className={isAccordeonExpanded ? 'iconRotate' : ''}
                  onClick={handleAccordeonClick}
                >
                  <AvalibleArrowLable>{mutations.length} mutations</AvalibleArrowLable>
                  {availableIcon}
                </AvalibleArrowBlock>
              </AvalibleLableBlock>

              {isAccordeonExpanded
                ? mutations.map((mut) => (
                    <InputBlock
                      key={mut.id}
                      isActive={mut.id === selectedMutation?.id}
                      onClick={() => handleMutationClick(mut.id)}
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
                  ))
                : null}
            </AvalibleMutations>
          </SimpleBar>
        </MutationsList>
      )}
    </WrapperDropdown>
  )
}
