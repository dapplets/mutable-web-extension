import { AppMetadata, Mutation } from 'mutable-web-engine'
import { useAccountId } from 'near-social-vm'
import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useCreateMutation } from '../../contexts/mutable-web-context/use-create-mutation'
import { useEditMutation } from '../../contexts/mutable-web-context/use-edit-mutation'
import { cloneDeep, compareMutations, mergeDeep } from '../../helpers'
import { useEscape } from '../../hooks/use-escape'
import { Alert, AlertProps } from './alert'
import { ApplicationCard } from './application-card'
import { Button } from './button'
import { DropdownButton } from './dropdown-button'
import { Input } from './input'

const SelectedMutationEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  gap: 10px;
  border-radius: 10px;
  font-family: sans-serif;
  border: 1px solid #02193a;
  background: #f8f9ff;
  width: 400px;
  max-height: 70vh;
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
  gap: 20px;

  .edit {
    margin-right: auto;
    margin-bottom: 2px;
  }
`

const HeaderTitle = styled.div`
  line-height: 40px;
  color: #02193a;
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

const createEmptyMutation = (accountId: string): Mutation => ({
  id: `${accountId}/mutation/Untitled`,
  apps: [],
  metadata: {
    name: '',
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { in: [window.location.hostname] } },
    },
  ],
})

export interface Props {
  apps: AppMetadata[]
  baseMutation: Mutation | null
  onClose: () => void
}

export enum MutationModalMode {
  Editing = 'editing',
  Creating = 'creating',
  Forking = 'forking',
}

interface IAlert extends AlertProps {
  id: string
  shortText?: string
}

const alerts: { [name: string]: IAlert } = {
  noWallet: {
    id: 'noWallet',
    text: 'You must connect the NEAR wallet to create the mutation.',
    severity: 'warning',
    shortText: 'You must connect the NEAR wallet',
  },
  emptyMutation: {
    id: 'emptyMutation',
    text: 'The mutation is empty. Add applications to create the mutation.',
    severity: 'error',
  },
  notEditedMutation: {
    id: 'notEditedMutation',
    text: 'The mutation fork must be edited. Add or remove applications to create a new mutation.',
    severity: 'error',
  },
  idIsNotUnique: {
    id: 'idIsNotUnique',
    text: 'This mutation ID already exists. Add another ID to create a new mutation, or change the NEAR wallet to edit your existing one.',
    severity: 'error',
  },
}

export const MutationEditorModal: FC<Props> = ({ baseMutation, apps, onClose }) => {
  const loggedInAccountId = useAccountId()
  const { createMutation, isLoading: isCreating } = useCreateMutation()
  const { editMutation, isLoading: isEditing } = useEditMutation()

  // Close modal with escape key
  useEscape(onClose)

  const originalMutation = useMemo(
    () => baseMutation ?? createEmptyMutation(loggedInAccountId ?? 'dapplets.near'),
    [baseMutation, loggedInAccountId]
  )

  const [editingMutation, setEditingMutation] = useState(originalMutation)

  const [mutationAuthorId] = editingMutation.id.split('/')
  const isOwn = mutationAuthorId === loggedInAccountId

  const [mode, setMode] = useState(
    !baseMutation
      ? MutationModalMode.Creating
      : isOwn
      ? MutationModalMode.Editing
      : MutationModalMode.Forking
  )

  const isModified = useMemo(
    () => !(baseMutation ? compareMutations(baseMutation, editingMutation) : false),
    [baseMutation, editingMutation]
  )

  const [alert, setAlert] = useState<IAlert | null>(null)

  useEffect(() => {
    const doChecksForAlerts = (): IAlert | null => {
      if (!loggedInAccountId) return alerts.noWallet
      if (!editingMutation?.apps || editingMutation?.apps?.length === 0) return alerts.emptyMutation
      if (!isModified) return alerts.notEditedMutation
      return null
    }
    setAlert(doChecksForAlerts())
  }, [loggedInAccountId, editingMutation, isModified])

  const isFormDisabled = !isModified || isCreating || isEditing || !!alert

  const handleMutationIdChange = (id: string) => {
    setEditingMutation((mut) => mergeDeep(cloneDeep(mut), { id }))
  }

  const handleMutationNameChange = (name: string) => {
    setEditingMutation((mut) => mergeDeep(cloneDeep(mut), { metadata: { name } }))
  }

  const handleAppCheckboxChange = (appId: string, checked: boolean) => {
    setEditingMutation((mut) => {
      const apps = checked ? [...mut.apps, appId] : mut.apps.filter((app) => app !== appId)
      return mergeDeep(cloneDeep(mut), { apps })
    })
  }

  const handleRevertClick = () => {
    setEditingMutation(cloneDeep(originalMutation))
  }

  const handleSaveClick = () => {
    if (mode === MutationModalMode.Creating || mode === MutationModalMode.Forking) {
      createMutation(editingMutation).then(() => onClose())
    } else if (mode === MutationModalMode.Editing) {
      editMutation(editingMutation).then(() => onClose())
    }
  }

  const handleSaveDropdownChange = (itemId: string) => {
    setMode(itemId as MutationModalMode)
  }

  return (
    <SelectedMutationEditorWrapper>
      <HeaderEditor>
        <HeaderTitle>
          {mode === MutationModalMode.Creating ? 'Create Mutation' : null}
          {mode === MutationModalMode.Editing ? 'Edit Mutation' : null}
          {mode === MutationModalMode.Forking ? 'Fork Mutation' : null}
        </HeaderTitle>
        <Close onClick={onClose}>
          <CloseIcon />
        </Close>
      </HeaderEditor>

      {alert ? <Alert severity={alert.severity} text={alert.text} /> : null}

      <Input
        label="Mutation ID"
        value={editingMutation.id}
        placeholder="dapplets.near/mutation/web"
        onChange={handleMutationIdChange}
        disabled={mode === MutationModalMode.Editing}
      />

      <Input
        label="Mutation Name"
        value={editingMutation.metadata.name ?? ''}
        placeholder="My Mutation"
        onChange={handleMutationNameChange}
      />

      <AppsList>
        {apps.map((app) => (
          <ApplicationCard
            key={app.id}
            src={app.id}
            metadata={app.metadata}
            isChecked={editingMutation.apps.includes(app.id)}
            onChange={(val) => handleAppCheckboxChange(app.id, val)}
          />
        ))}
      </AppsList>

      <ButtonsBlock>
        <Button disabled={isFormDisabled} onClick={handleRevertClick}>
          Revert changes
        </Button>
        <DropdownButton
          value={mode}
          items={[
            { value: MutationModalMode.Forking, title: 'Fork', visible: !!baseMutation },
            { value: MutationModalMode.Editing, title: 'Save', visible: !!baseMutation && isOwn },
            { value: MutationModalMode.Creating, title: 'Create', visible: !baseMutation },
          ]}
          onClick={handleSaveClick}
          onChange={handleSaveDropdownChange}
          disabled={isFormDisabled}
        />
      </ButtonsBlock>
    </SelectedMutationEditorWrapper>
  )
}
