import React, { FC, useState } from 'react'

export interface Props {
  image?:
    | {
        ipfs_cid?: string
        url?: string
      }
    | string

  fallbackUrl?: string
  alt?: string
}

export const Image: FC<Props> = ({ image, alt, fallbackUrl }) => {
  const [imageUrl, setImageUrl] = useState(() => {
    if (typeof image === 'string') {
      return image
    } else if (image) {
      return image.ipfs_cid
        ? `https://ipfs.near.social/ipfs/${image.ipfs_cid}`
        : image.url || fallbackUrl
    } else {
      return fallbackUrl || ''
    }
  })

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => {
        if (imageUrl !== fallbackUrl) {
          setImageUrl(fallbackUrl)
        }
      }}
    />
  )
}
