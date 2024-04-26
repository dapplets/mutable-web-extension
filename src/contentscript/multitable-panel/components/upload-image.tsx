import React, { FC, useId } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'

const InputContainer = styled.div`
  display: flex;
  gap: 6px;

  label {
    font-size: 14px;
  }

  .form-floating {
    position: relative;
    width: calc(100% - 54px);
    svg {
      position: absolute;
      right: 10px;
      top: 15px;
    }
  }
  .form-floating > .form-control {
    height: 48px;
    min-height: 48px;
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
    padding-left: 0.75rem;
    padding-right: 2.5rem;
  }
  input {
    flex: 1;
    padding: 10px 10px;
    border-radius: 10px;
    border: 1px solid #e2e2e5;
    font-size: 14px;

    &:focus {
      border: 1px solid rgba(56, 75, 255, 1);
      outline: none;
    }
  }
`
const CustomFileUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid #e2e2e5;
  background: #fff;
  cursor: pointer;
`

const UploadInput = styled.input`
  display: none;
`

const UploadIcon = styled.div``

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.008 3C21.556 3 22 3.445 22 3.993V13.342C21.3576 13.1151 20.6813 12.9994 20 13V5H4L4.001 19L13.293 9.707C13.465 9.53448 13.694 9.43073 13.9371 9.41526C14.1802 9.39979 14.4206 9.47367 14.613 9.623L14.707 9.708L18.252 13.258C17.4766 13.4943 16.7572 13.8851 16.1369 14.407C15.5167 14.9288 15.0086 15.5709 14.6432 16.2944C14.2779 17.0179 14.0628 17.808 14.0111 18.6169C13.9593 19.4258 14.0719 20.2368 14.342 21.001L2.992 21C2.72881 20.9997 2.4765 20.895 2.29049 20.7088C2.10448 20.5226 2 20.2702 2 20.007V3.993C2.00183 3.73038 2.1069 3.47902 2.29251 3.29322C2.47813 3.10742 2.72938 3.00209 2.992 3H21.008ZM8 7C8.53043 7 9.03914 7.21071 9.41421 7.58579C9.78929 7.96086 10 8.46957 10 9C10 9.53043 9.78929 10.0391 9.41421 10.4142C9.03914 10.7893 8.53043 11 8 11C7.46957 11 6.96086 10.7893 6.58579 10.4142C6.21071 10.0391 6 9.53043 6 9C6 8.46957 6.21071 7.96086 6.58579 7.58579C6.96086 7.21071 7.46957 7 8 7Z"
      fill="#7A818B"
    />
  </svg>
)

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
      stroke="#384BFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.3334 5.33333L8.00002 2L4.66669 5.33333"
      stroke="#384BFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V10"
      stroke="#384BFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface Props {
  label: string
  handleImageChange: (event: any) => Promise<void>
  uploadedImageCID: string | null
}
export const InputImage: FC<Props> = ({ label, handleImageChange, uploadedImageCID }) => {
  const inputId = useId()

  return (
    <InputContainer>
      <CustomFileUpload>
        <UploadInput type="file" accept="image/*" onChange={handleImageChange} />
        <UploadIcon>
          <IconImage />
        </UploadIcon>
      </CustomFileUpload>

      <FloatingLabel controlId={inputId} label={label} className="mb-3">
        <Form.Control readOnly value={uploadedImageCID ? uploadedImageCID : ''} type="text" />

        <IconUpload />
      </FloatingLabel>
    </InputContainer>
  )
}
