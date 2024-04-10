// ToDo: export types
import { AppMetadata, MutationWithSettings } from 'mutable-web-engine'
import { useAccountId } from 'near-social-vm'
import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { ApplicationCard } from './application-card'

const SelectedMutationEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  gap: 20px;
  border-radius: 10px;
  font-family: sans-serif;
  border: 1px solid #02193a;
  background: #f8f9ff;
  width: 400px;
  max-height: 446px;
`

const Close = styled.span`
  cursor: pointer;
  svg {
    margin: 0;
  }
  &:hover {
    opacity: 0.5;
  }
`

const HeaderEditor = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(2, 25, 58, 1);
  font-size: 18px;
  font-weight: 600;
  line-height: 21.09px;
  text-align: left;
  .edit {
    margin-right: auto;
    margin-bottom: 2px;
  }
`

const AppsList = styled.div`
  overflow: hidden;
  overflow-y: auto;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ButtonsBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ButtonsRevert = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(226, 226, 229, 1);
  color: rgba(2, 25, 58, 1);
  width: 175px;
  height: 42px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
  text-align: center;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:disabled {
    cursor: auto;
    opacity: 1;
  }
`

const ButtonsSave = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 42px;
  border-radius: 10px;
  border: none;
  background: rgba(56, 75, 255, 1);
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
  text-align: center;
  position: relative;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`

const TextSave = styled.div`
  display: inline-block;
  overflow: hidden;
  word-wrap: no-wrap;
  text-overflow: ellipsis;
  width: 100%;
  padding: 0 10px;
  text-align: center;
  &:hover {
    opacity: 0.5;
  }
`

const ArrowWrapper = styled.div<{ isOpened: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  margin-left: auto;
  transform: ${(props) => (props.isOpened ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const SaveChanges = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  right: 0;
  top: 52px;
  width: 175px;
  max-height: 112px;
  padding: 10px;
  gap: 10px;
  border-radius: 10px;
  background: rgba(231, 236, 239, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
  text-align: center;
  color: rgba(34, 34, 34, 1);
`

const SaveChangesItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 41px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: rgba(217, 222, 225, 1);
    color: rgba(56, 75, 255, 1);
  }
`

const Input = styled.input`
  display: flex;
  flex: 1;
  border: none;
  background: none;
  margin: 0;
  max-width: 250px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  padding-right: 20px;
  color: var(--sand12);
  font: var(--text-base);
  outline: none !important;
  text-align: left;
  transition: color 200ms, opacity 200ms;

  [data-textarea='true'] & {
    line-height: 1.5;
    padding: 8px 12px;
    height: unset;
    min-height: 5.5rem;
  }

  &::placeholder {
    color: var(--sand10);
    font: var(--text-base);
    opacity: 1;
  }

  [data-disabled='true'] & {
    opacity: 1;
    color: var(--sand9);

    &::placeholder {
      color: var(--sand9);
    }
  }
`

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
    <path
      d="M21 9L9 21"
      stroke="#02193A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9L21 21"
      stroke="#02193A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="edit"
  >
    <path
      d="M12 18H19"
      stroke="#7A818B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.2504 5.47176C15.5524 5.1697 15.9621 5 16.3893 5C16.6008 5 16.8103 5.04166 17.0057 5.12261C17.2011 5.20355 17.3787 5.32219 17.5282 5.47176C17.6778 5.62133 17.7964 5.79889 17.8774 5.99431C17.9583 6.18972 18 6.39917 18 6.61069C18 6.82221 17.9583 7.03166 17.8774 7.22708C17.7964 7.42249 17.6778 7.60006 17.5282 7.74962L8.03715 17.2407L5 18L5.75929 14.9629L15.2504 5.47176Z"
      stroke="#7A818B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
    <path
      d="M1 1L7 7L13 1"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export interface Props {
  mutationId: string | null
  mutationName: string | undefined
  allApps: AppMetadata[]
  selectedApps: string[]
  onClose: () => void
  onMutationNameChange: (newMutationName: string) => void
  onMutationAppsChange: (newApp: string) => void
  onMutationReset: () => void
  onMutationCreate: () => void
  onMutationEdit: () => void
  onMutationIdChange: (newMutationId: string, loggedInAccountId: string) => void
  isRevertDisable: boolean
  isVisibleInputId: boolean
  setVisibleInputId: (isVisible: boolean) => void
  selectedMutation: MutationWithSettings | null
  editingMutation: MutationWithSettings | null
  isSaveDisabled: boolean
  saveTooltype?: string | null
  setSaveDisabled: (isSaveDisabled: boolean) => void
  setSaveTooltype: (tooltip: string | null) => void
  setVisibleInput: (isVisible: boolean) => void
  isVisibleInput: boolean
}

export const MutationEditorModal: FC<Props> = (props) => {
  const {
    mutationId,
    mutationName,
    allApps,
    selectedApps,
    onClose,
    onMutationNameChange,
    onMutationAppsChange,
    onMutationReset,
    onMutationCreate,
    onMutationEdit,
    onMutationIdChange,
    isRevertDisable,
    isVisibleInputId,
    setVisibleInputId,
    // selectedMutation,
    // editingMutation,
    isSaveDisabled,
    saveTooltype,
    // setSaveDisabled,
    // setSaveTooltype,
    setVisibleInput,
    isVisibleInput,
  } = props

  // ToDo: check null props

  const loggedInAccountId: string | null = useAccountId()

  const mutationOwnerId = mutationId ? mutationId.split('/')[0] : null

  const isUserOwner = mutationOwnerId === loggedInAccountId

  const [isSaveDropdownOpened, setIsSaveDropdownOpened] = useState(false)

  const handlePublishButtonClick = () => {
    setIsSaveDropdownOpened(false)
    setVisibleInputId(false)
  }

  const handleForkButtonClick = () => {
    setIsSaveDropdownOpened(false)
    setVisibleInputId(true)
  }

  const handleDropdownOpen = () => {
    if (!isUserOwner) return

    setIsSaveDropdownOpened((val) => !val)
  }

  //   const arraysAreEqual = (a, b) => {
  //     if (a.length != b.length) return false
  //     for (var i = 0; i <= a.length; i++) {
  //       if (a[i] != b[i]) return false
  //     }
  //     return true
  //   }

  //   if (!loggedInAccountId) {
  //     setSaveDisabled(true)
  //     setSaveTooltype('Connect the Wallet')
  //   } else if (loggedInAccountId && selectedMutation) {
  //     if (editingMutation.id === selectedMutation.id) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Change the mutation to create a new one')
  //     } else if (editingMutation.metadata.name === selectedMutation.metadata.name) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Mutation name has already been used')
  //     } else if (
  //       editingMutation.metadata.name !== selectedMutation.metadata.name &&
  //       editingMutation.id === selectedMutation.id
  //     ) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Add mutation ID')
  //     } else if (!editingMutation.apps || !editingMutation.apps.length) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Select applications')
  //     } else {
  //       setSaveDisabled(false)
  //       setSaveTooltype(null)
  //     }
  //   } else if (loggedInAccountId && !selectedMutation) {
  //     if (!editingMutation.metadata.name) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Mutation name has already been used')
  //     } else if (!editingMutation.id) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Add mutation ID')
  //     } else if (!editingMutation.apps || !editingMutation.apps.length) {
  //       setSaveDisabled(true)
  //       setSaveTooltype('Select applications')
  //     } else {
  //       setSaveDisabled(false)
  //       setSaveTooltype(null)
  //     }
  //   } else {
  //     setSaveDisabled(false)
  //     setSaveTooltype(null)
  //   }

  return (
    <SelectedMutationEditorWrapper>
      {isVisibleInput ? (
        <HeaderEditor>
          <Input
            onChange={(e) => onMutationNameChange(e.target.value)}
            value={mutationName ? mutationName : ''}
          />
          <Close onClick={onClose}>
            <CloseIcon />
          </Close>
        </HeaderEditor>
      ) : (
        <HeaderEditor>
          {mutationName ? mutationName : ''}
          <span onClick={() => setVisibleInput(true)}>
            <EditIcon />
          </span>

          <Close onClick={onClose}>
            <CloseIcon />
          </Close>
        </HeaderEditor>
      )}

      {!isUserOwner || isVisibleInputId ? (
        isVisibleInput ? (
          <HeaderEditor>
            <Input
              onChange={(e) => onMutationIdChange(e.target.value, loggedInAccountId!)}
              placeholder={'Enter Mutation ID'}
            />
          </HeaderEditor>
        ) : (
          <HeaderEditor>
            {loggedInAccountId}

            <span onClick={() => setVisibleInput(true)}>
              <EditIcon />
            </span>
          </HeaderEditor>
        )
      ) : null}
      <AppsList>
        {allApps && allApps.length
          ? allApps.map((app, i) => (
              <ApplicationCard
                key={i}
                src={app.id}
                metadata={app.metadata}
                // hideButtons={!loggedInAccountId}
                selectedApps={selectedApps ? selectedApps.filter((x) => x === app.id)[0] : null}
                handleEditMutationApps={onMutationAppsChange}
              />
            ))
          : null}
      </AppsList>
      <ButtonsBlock>
        <ButtonsRevert disabled={isRevertDisable} onClick={onMutationReset}>
          Revert changes
        </ButtonsRevert>
        <ButtonsSave title={saveTooltype ?? undefined} disabled={isSaveDisabled}>
          {isUserOwner && !isVisibleInputId ? (
            <TextSave onClick={onMutationEdit}>Publish</TextSave>
          ) : (
            <TextSave onClick={onMutationCreate}>Fork</TextSave>
          )}

          <ArrowWrapper isOpened={isSaveDropdownOpened} onClick={handleDropdownOpen}>
            <ArrowIcon />
          </ArrowWrapper>
          {isSaveDropdownOpened && isUserOwner ? (
            <SaveChanges>
              {/* {isUserOwner && !isVisibleInputId ? ( */}
              <SaveChangesItem onClick={handlePublishButtonClick}>Publish</SaveChangesItem>
              {/* ) : ( */}
              <SaveChangesItem onClick={handleForkButtonClick}>Fork</SaveChangesItem>
              {/* )} */}
            </SaveChanges>
          ) : null}
        </ButtonsSave>
      </ButtonsBlock>
    </SelectedMutationEditorWrapper>
  )
}
