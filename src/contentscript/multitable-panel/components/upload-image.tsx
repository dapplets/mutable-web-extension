import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { Image } from './image'

const InputContainer = styled.div`
  display: flex;
  gap: 6px;
  align-self: center;
`
const CustomFileUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid #e2e2e5;
  background: #fff;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`

const UploadInput = styled.input`
  display: none;
`

const UploadIcon = styled.div``

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M19 13.6667V17.2222C19 17.6937 18.8127 18.1459 18.4793 18.4793C18.1459 18.8127 17.6937 19 17.2222 19H4.77778C4.30628 19 3.8541 18.8127 3.5207 18.4793C3.1873 18.1459 3 17.6937 3 17.2222V13.6667"
      stroke="#7A818B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.4445 7.44444L11 3L6.55557 7.44444"
      stroke="#7A818B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 3V13.6667"
      stroke="#7A818B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface Props {
  handleImageChange: (event: any) => Promise<void>
  uploadedImageCID: string | null
  defaultCID?:
    | {
        ipfs_cid?: string
        url?: string
      }
    | undefined
}

export const InputImage: FC<Props> = ({ handleImageChange, uploadedImageCID, defaultCID }) => {
  const image = {
    ipfs_cid: uploadedImageCID ? uploadedImageCID : defaultCID ? defaultCID.ipfs_cid : undefined,
  }
  useEffect(() => {}, [image, uploadedImageCID, defaultCID, handleImageChange])

  return (
    <InputContainer onChange={handleImageChange}>
      {image && image.ipfs_cid ? (
        <CustomFileUpload onChange={handleImageChange}>
          <UploadInput type="file" accept="image/*" />
          <Image image={image} />
        </CustomFileUpload>
      ) : (
        <CustomFileUpload onChange={handleImageChange}>
          <UploadInput type="file" accept="image/*" />
          <UploadIcon>
            <IconImage />
          </UploadIcon>
        </CustomFileUpload>
      )}
    </InputContainer>
  )
}
