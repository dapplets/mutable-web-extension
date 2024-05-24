import { AppWithSettings, Mutation } from 'mutable-web-engine'
import { useAccountId } from 'near-social-vm'
import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { useMutableWeb, useMutationApp } from '../contexts/mutable-web-context'
import { Image } from '../multitable-panel/components/image'
import Profile from './profile'

const SidePanelWrapper = styled.div<{ $isApps: boolean }>`
  position: fixed;
  z-index: 5000;
  display: flex;
  width: 58px;
  padding: 6px;
  top: 55px;
  right: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px 0px 0px 4px;
  background: ${(props) => (props.$isApps ? '#EEEFF5' : '#F8F9FF')};
  box-shadow: 0 4px 20px 0 rgba(11, 87, 111, 0.15);
  font-family: sans-serif;
  box-sizing: border-box;
`

const TopBlock = styled.div<{ $open?: boolean; $noMutations: boolean }>`
  display: flex;
  width: 58px;
  flex-direction: column;
  justify-content: center;
  padding: 6px;
  background: ${(props) => (props.$open ? '#fff' : 'transparent')};
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #e2e2e5;
  border-radius: ${(props) => (props.$noMutations ? '4px 0 0 4px' : '4px 0 0 0')};
`

const MutationIconWrapper = styled.button<{ $isStopped?: boolean }>`
  display: flex;
  box-sizing: border-box;
  width: 46px;
  height: 46px;
  outline: none;
  border: none;
  background: #fff;
  padding: 0;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
  position: relative;
  box-shadow: 0 4px 5px 0 rgba(45, 52, 60, 0.2);

  .labelAppCenter {
    visibility: hidden;
    opacity: 0;
  }

  img {
    box-sizing: border-box;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    filter: ${(props) => (props.$isStopped ? 'grayscale(1)' : 'grayscale(0)')};
    transition: all 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 0px 4px 20px 0px #0b576f26, 0px 4px 5px 0px #2d343c1a;

    img {
      filter: brightness(115%);
    }
  }

  &:active {
    box-shadow: 0px 4px 20px 0px #0b576f26, 0px 4px 5px 0px #2d343c1a;

    img {
      filter: brightness(125%);
    }
  }

  &:hover .labelAppCenter {
    visibility: visible;
    opacity: 1;
  }

  &:hover .labelAppTop {
    opacity: ${(props) => (props.$isStopped ? '0' : '1')};
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  box-sizing: content-box !important;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 46px;
  margin-top: -7px;
  padding: 0 5px 5px;
`

const AppsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 6px;
  gap: 10px;
`

const LabelAppCenter = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  top: 25%;
  left: 25%;
  width: 24px;
  height: 24px;
  cursor: pointer;
`

const LabelAppTop = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  cursor: pointer;
`

const ButtonOpenWrapper = styled.div<{ $open?: boolean }>`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 32px;
  background: ${(props) => (props.$open ? '#fff' : 'transparent')};
  padding-left: 6px;
  padding-right: 6px;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #e2e2e5;
  border-radius: 0 0 0 4px;
  transition: all 0.2s ease;

  .svgTransform {
    svg {
      transition: all 0.2s ease;
      transform: rotate(180deg);
    }
  }
`

const ButtonOpen = styled.button<{ $open?: boolean }>`
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 22px;
  outline: none;
  background: transparent;
  border-radius: 4px;
  border: ${(props) => (props.$open ? 'none' : '1px solid #e2e2e5')};
  padding: 0;
  transition: all 0.2s ease;

  path {
    transition: all 0.2s ease;
    stroke: #7a818b;
  }

  &:hover {
    transition: all 0.2s ease;
    transform: scale(1.1);
    background: #fff;

    path {
      stroke: #384bff;
    }
  }

  &:active {
    transform: scale(1.1);
    background: #384bff;

    path {
      stroke: #fff;
    }
    transition: all 0.2s ease;
  }
`

// todo: replace on iconDefault. Now - from layout
const MutationFallbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" fill="none">
    <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#02193A" />
    <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#E2E2E5" />
    <path
      d="M19.4547 36C19.1732 36 18.8908 35.8999 18.6645 35.696C18.1791 35.2602 18.1398 34.512 18.5765 34.0275C18.7009 33.8891 18.8216 33.7498 18.9385 33.6095L16.2553 30.9262C15.7933 30.4642 15.7933 29.7169 16.2553 29.2549C16.7173 28.7929 17.4646 28.7929 17.9266 29.2549L20.2983 31.6267C20.6097 31.0543 20.8669 30.4614 21.0755 29.8366L19.8017 28.5628C19.3397 28.1008 19.3397 27.3535 19.8017 26.8915C20.2637 26.4295 21.011 26.4295 21.473 26.8915L21.7404 27.159C21.9724 26.7437 22.4493 26.4865 22.9422 26.566C23.5884 26.6596 24.0364 27.2581 23.9429 27.9044C23.8475 28.5609 23.7184 29.1922 23.5538 29.8011C23.552 29.8076 23.5501 29.8151 23.5482 29.8226C22.9581 31.9821 21.9134 33.8536 20.3348 35.6081C20.1019 35.8681 19.7793 35.9991 19.4557 35.9991L19.4547 36ZM11.1826 27.7267C10.859 27.7267 10.5373 27.5948 10.3035 27.3358C9.86674 26.8513 9.90602 26.1031 10.3914 25.6672C16.1599 20.4738 21.8676 22.305 27.2134 21.6475C27.0525 21.2257 27.1433 20.7309 27.4827 20.3914C27.9448 19.9294 28.692 19.9294 29.154 20.3914L29.8339 21.0704C30.4315 20.8694 31.0273 20.6159 31.623 20.2932L31.6193 20.2895C31.1573 19.8275 31.1573 19.0802 31.6193 18.6182C32.0813 18.1562 32.8285 18.1562 33.2905 18.6182L33.6104 18.9371C33.7488 18.8211 33.8881 18.7005 34.0284 18.5752C34.5129 18.1375 35.2611 18.1777 35.6969 18.6631C36.1327 19.1485 36.0944 19.8958 35.609 20.3316C29.8386 25.5251 24.1243 23.6939 18.787 24.3513C18.9469 24.7731 18.8571 25.2679 18.5176 25.6074C18.0556 26.0694 17.3084 26.0694 16.8464 25.6074L16.1674 24.9284C15.5688 25.1276 14.9731 25.3829 14.3783 25.7056L14.3811 25.7093C14.8431 26.1714 14.8431 26.9186 14.3811 27.3806C13.9191 27.8427 13.1718 27.8427 12.7098 27.3806L12.3909 27.0617C12.2516 27.1768 12.1122 27.2974 11.9729 27.4227C11.7475 27.6257 11.4641 27.7267 11.1826 27.7267ZM25.3635 19.4534C25.0614 19.4534 24.7584 19.3383 24.5284 19.1073L24.2609 18.8399C24.028 19.2551 23.5529 19.5001 23.0591 19.4337C22.4129 19.3402 21.9649 18.7407 22.0584 18.0954C22.4933 15.0923 23.6399 12.6447 25.6675 10.3907C26.1052 9.90625 26.8505 9.86697 27.3359 10.3028C27.8204 10.7386 27.8596 11.4868 27.4238 11.9713C27.2994 12.1097 27.1779 12.2491 27.0619 12.3894L29.7451 15.0726C30.2071 15.5346 30.2071 16.2819 29.7451 16.7439C29.2831 17.206 28.5358 17.206 28.0738 16.7439L25.7021 14.3721C25.3897 14.9464 25.1316 15.5421 24.923 16.1688C24.9558 16.1949 24.9876 16.2239 25.0175 16.2539L26.1996 17.436C26.6616 17.898 26.6616 18.6453 26.1996 19.1073C25.9686 19.3383 25.6665 19.4534 25.3644 19.4534H25.3635Z"
      fill="white"
    />
  </svg>
)

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
    <path
      d="M1.5 1.25L7 6.75L12.5 1.25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const StopTopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask
      id="path-1-outside-1_257_34"
      maskUnits="userSpaceOnUse"
      x="0.166687"
      y="0.166672"
      width="16"
      height="16"
      fill="black"
    >
      <rect fill="white" x="0.166687" y="0.166672" width="16" height="16" />
      <path d="M8.00002 2.16667C7.23398 2.16667 6.47543 2.31756 5.7677 2.61071C5.05997 2.90386 4.41691 3.33354 3.87523 3.87522C2.78127 4.96918 2.16669 6.45291 2.16669 8.00001C2.16669 9.5471 2.78127 11.0308 3.87523 12.1248C4.41691 12.6665 5.05997 13.0962 5.7677 13.3893C6.47543 13.6825 7.23398 13.8333 8.00002 13.8333C9.54712 13.8333 11.0308 13.2188 12.1248 12.1248C13.2188 11.0308 13.8334 9.5471 13.8334 8.00001C13.8334 7.23396 13.6825 6.47542 13.3893 5.76769C13.0962 5.05995 12.6665 4.41689 12.1248 3.87522C11.5831 3.33354 10.9401 2.90386 10.2323 2.61071C9.52461 2.31756 8.76607 2.16667 8.00002 2.16667ZM6.25002 6.25001H9.75002V9.75001H6.25002" />
      <path d="M5.66669 5.66667H10.3334V10.3333H5.66669V5.66667Z" />
    </mask>
    <path
      d="M8.00002 2.16667C7.23398 2.16667 6.47543 2.31756 5.7677 2.61071C5.05997 2.90386 4.41691 3.33354 3.87523 3.87522C2.78127 4.96918 2.16669 6.45291 2.16669 8.00001C2.16669 9.5471 2.78127 11.0308 3.87523 12.1248C4.41691 12.6665 5.05997 13.0962 5.7677 13.3893C6.47543 13.6825 7.23398 13.8333 8.00002 13.8333C9.54712 13.8333 11.0308 13.2188 12.1248 12.1248C13.2188 11.0308 13.8334 9.5471 13.8334 8.00001C13.8334 7.23396 13.6825 6.47542 13.3893 5.76769C13.0962 5.05995 12.6665 4.41689 12.1248 3.87522C11.5831 3.33354 10.9401 2.90386 10.2323 2.61071C9.52461 2.31756 8.76607 2.16667 8.00002 2.16667ZM6.25002 6.25001H9.75002V9.75001H6.25002"
      fill="#F43024"
    />
    <path d="M5.66669 5.66667H10.3334V10.3333H5.66669V5.66667Z" fill="white" />
    <path
      d="M2.16669 8.00001H0.166687H2.16669ZM8.00002 13.8333V15.8333V13.8333ZM9.75002 6.25001H11.75V4.25001H9.75002V6.25001ZM9.75002 9.75001V11.75H11.75V9.75001H9.75002ZM5.66669 5.66667V3.66667H3.66669V5.66667H5.66669ZM10.3334 5.66667H12.3334V3.66667H10.3334V5.66667ZM10.3334 10.3333V12.3333H12.3334V10.3333H10.3334ZM5.66669 10.3333H3.66669V12.3333H5.66669V10.3333ZM8.00002 0.166672C6.97133 0.166672 5.95272 0.369287 5.00233 0.762949L6.53307 4.45847C6.99815 4.26582 7.49662 4.16667 8.00002 4.16667L8.00002 0.166672ZM5.00233 0.762949C4.05195 1.15661 3.18841 1.73361 2.46102 2.461L5.28944 5.28943C5.6454 4.93347 6.06799 4.65111 6.53307 4.45847L5.00233 0.762949ZM2.46102 2.461C0.991982 3.93004 0.166687 5.92248 0.166687 8.00001L4.16669 8.00001C4.16669 6.98334 4.57055 6.00832 5.28944 5.28943L2.46102 2.461ZM0.166687 8.00001C0.166687 10.0775 0.991982 12.07 2.46102 13.539L5.28944 10.7106C4.57055 9.99169 4.16669 9.01667 4.16669 8.00001L0.166687 8.00001ZM2.46102 13.539C3.18841 14.2664 4.05195 14.8434 5.00233 15.2371L6.53307 11.5415C6.06799 11.3489 5.6454 11.0665 5.28944 10.7106L2.46102 13.539ZM5.00233 15.2371C5.95272 15.6307 6.97133 15.8333 8.00002 15.8333L8.00002 11.8333C7.49662 11.8333 6.99815 11.7342 6.53307 11.5415L5.00233 15.2371ZM8.00002 15.8333C10.0775 15.8333 12.07 15.008 13.539 13.539L10.7106 10.7106C9.99171 11.4295 9.01668 11.8333 8.00002 11.8333L8.00002 15.8333ZM13.539 13.539C15.0081 12.07 15.8334 10.0775 15.8334 8.00001H11.8334C11.8334 9.01667 11.4295 9.99169 10.7106 10.7106L13.539 13.539ZM15.8334 8.00001C15.8334 6.97132 15.6307 5.9527 15.2371 5.00232L11.5416 6.53305C11.7342 6.99813 11.8334 7.4966 11.8334 8.00001H15.8334ZM15.2371 5.00232C14.8434 4.05193 14.2664 3.18839 13.539 2.461L10.7106 5.28943C11.0666 5.64539 11.3489 6.06797 11.5416 6.53305L15.2371 5.00232ZM13.539 2.461C12.8116 1.73361 11.9481 1.15661 10.9977 0.762949L9.46697 4.45847C9.93206 4.65111 10.3546 4.93347 10.7106 5.28943L13.539 2.461ZM10.9977 0.762949C10.0473 0.369287 9.02871 0.166672 8.00002 0.166672L8.00002 4.16667C8.50342 4.16667 9.00189 4.26582 9.46697 4.45847L10.9977 0.762949ZM6.25002 8.25001H9.75002V4.25001H6.25002V8.25001ZM7.75002 6.25001V9.75001H11.75V6.25001H7.75002ZM9.75002 7.75001H6.25002V11.75H9.75002V7.75001ZM5.66669 7.66667H10.3334V3.66667H5.66669V7.66667ZM8.33335 5.66667V10.3333H12.3334V5.66667H8.33335ZM10.3334 8.33334H5.66669V12.3333H10.3334V8.33334ZM7.66669 10.3333V5.66667H3.66669V10.3333H7.66669Z"
      fill="white"
      mask="url(#path-1-outside-1_257_34)"
    />
  </svg>
)

const PlayCenterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_194_475)">
      <path
        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"
        fill="#02193A"
      />
      <path d="M16.7 12L9.95 16.3301L9.95 7.66987L16.7 12Z" fill="white" />
      <path
        d="M12 1C10.5555 1 9.12506 1.28452 7.79048 1.83733C6.4559 2.39013 5.24327 3.20038 4.22183 4.22183C2.15893 6.28473 1 9.08262 1 12C1 14.9174 2.15893 17.7153 4.22183 19.7782C5.24327 20.7996 6.4559 21.6099 7.79048 22.1627C9.12506 22.7155 10.5555 23 12 23C14.9174 23 17.7153 21.8411 19.7782 19.7782C21.8411 17.7153 23 14.9174 23 12C23 10.5555 22.7155 9.12506 22.1627 7.79048C21.6099 6.4559 20.7996 5.24327 19.7782 4.22183C18.7567 3.20038 17.5441 2.39013 16.2095 1.83733C14.8749 1.28452 13.4445 1 12 1Z"
        stroke="white"
        strokeWidth="2"
      />
    </g>
    <defs>
      <clipPath id="clip0_194_475">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const StopCenterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_194_487)">
      <mask
        id="path-1-outside-1_194_487"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
        fill="black"
      >
        <rect fill="white" width="24" height="24" />
        <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM9 9H15V15H9" />
        <path d="M8 8H16V16H8V8Z" />
      </mask>
      <path
        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM9 9H15V15H9"
        fill="#02193A"
      />
      <path d="M8 8H16V16H8V8Z" fill="white" />
      <path
        d="M2 12H0H2ZM12 22V24V22ZM15 9H17V7H15V9ZM15 15V17H17V15H15ZM8 8V6H6V8H8ZM16 8H18V6H16V8ZM16 16V18H18V16H16ZM8 16H6V18H8V16ZM12 0C10.4241 0 8.86371 0.310389 7.4078 0.913446L8.93853 4.60896C9.90914 4.20693 10.9494 4 12 4V0ZM7.4078 0.913446C5.95189 1.5165 4.62902 2.40042 3.51472 3.51472L6.34315 6.34315C7.08601 5.60028 7.96793 5.011 8.93853 4.60896L7.4078 0.913446ZM3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12H4C4 9.87827 4.84285 7.84344 6.34315 6.34315L3.51472 3.51472ZM0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853L6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12H0ZM3.51472 20.4853C4.62902 21.5996 5.95189 22.4835 7.4078 23.0866L8.93853 19.391C7.96793 18.989 7.08602 18.3997 6.34315 17.6569L3.51472 20.4853ZM7.4078 23.0866C8.86371 23.6896 10.4241 24 12 24V20C10.9494 20 9.90914 19.7931 8.93853 19.391L7.4078 23.0866ZM12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853L17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20V24ZM20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12H20C20 14.1217 19.1571 16.1566 17.6569 17.6569L20.4853 20.4853ZM24 12C24 10.4241 23.6896 8.86371 23.0866 7.4078L19.391 8.93853C19.7931 9.90914 20 10.9494 20 12H24ZM23.0866 7.4078C22.4835 5.95189 21.5996 4.62902 20.4853 3.51472L17.6569 6.34315C18.3997 7.08602 18.989 7.96793 19.391 8.93853L23.0866 7.4078ZM20.4853 3.51472C19.371 2.40042 18.0481 1.5165 16.5922 0.913446L15.0615 4.60896C16.0321 5.011 16.914 5.60028 17.6569 6.34315L20.4853 3.51472ZM16.5922 0.913446C15.1363 0.310389 13.5759 0 12 0V4C13.0506 4 14.0909 4.20693 15.0615 4.60896L16.5922 0.913446ZM9 11H15V7H9V11ZM13 9V15H17V9H13ZM15 13H9V17H15V13ZM8 10H16V6H8V10ZM14 8V16H18V8H14ZM16 14H8V18H16V14ZM10 16V8H6V16H10Z"
        fill="white"
        mask="url(#path-1-outside-1_194_487)"
      />
    </g>
    <defs>
      <clipPath id="clip0_194_487">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const AppSwitcher: FC<{ app: AppWithSettings }> = ({ app }) => {
  const { enableApp, disableApp, isLoading } = useMutationApp(app.id)

  // ToDo: add loader using isLoading

  return (
    <MutationIconWrapper $isStopped={!app.settings.isEnabled}>
      {app?.metadata.image ? <Image image={app?.metadata.image} /> : <MutationFallbackIcon />}

      {!app.settings.isEnabled ? (
        <LabelAppTop className="labelAppTop">
          <StopTopIcon />
        </LabelAppTop>
      ) : null}

      {app.settings.isEnabled ? (
        <LabelAppCenter className="labelAppCenter" onClick={disableApp}>
          <StopCenterIcon />
        </LabelAppCenter>
      ) : (
        <LabelAppCenter className="labelAppCenter" onClick={enableApp}>
          <PlayCenterIcon />
        </LabelAppCenter>
      )}
    </MutationIconWrapper>
  )
}

interface SidePanelProps {
  baseMutation: Mutation | null
}

export const SidePanel: FC<SidePanelProps> = ({ baseMutation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setProfileOpen] = useState(false)
  const loggedInAccountId = useAccountId()
  const { mutationApps } = useMutableWeb()

  const handleMutationIconClick = () => {
    setProfileOpen((val) => !val)
  }

  return (
    <SidePanelWrapper
      $isApps={mutationApps.length > 0}
      data-mweb-context-type="mweb-overlay"
      data-mweb-context-parsed={JSON.stringify({ id: 'mweb-overlay' })}
    >
      <TopBlock $open={isOpen || mutationApps.length > 0} $noMutations={!mutationApps.length}>
        <MutationIconWrapper onClick={handleMutationIconClick}>
          {baseMutation?.metadata.image ? (
            <Image image={baseMutation?.metadata.image} />
          ) : (
            <MutationFallbackIcon />
          )}
        </MutationIconWrapper>
      </TopBlock>

      {isOpen || !mutationApps.length ? null : (
        <ButtonWrapper
          data-mweb-insertion-point="mweb-actions-panel"
          data-mweb-layout-manager="bos.dapplets.near/widget/VerticalLayoutManager"
        />
      )}

      {isOpen ? (
        <AppsWrapper>
          {mutationApps.map((app) => (
            <AppSwitcher key={app.id} app={app} />
          ))}
        </AppsWrapper>
      ) : null}

      {mutationApps.length > 0 ? (
        <ButtonOpenWrapper $open={isOpen || mutationApps.length > 0}>
          <ButtonOpen
            $open={isOpen}
            className={isOpen ? 'svgTransform' : ''}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowSvg />
          </ButtonOpen>
        </ButtonOpenWrapper>
      ) : null}

      {isProfileOpen ? (
        <Profile accountId={loggedInAccountId} closeProfile={() => setProfileOpen(false)} />
      ) : null}
    </SidePanelWrapper>
  )
}

export default SidePanel
