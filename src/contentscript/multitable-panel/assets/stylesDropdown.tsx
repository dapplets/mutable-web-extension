import styled from 'styled-components'

export const WrapperDropdown = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  width: 266px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;

  .simplebar-scrollbar::before {
    background-color: #384bff;
    width: 4px;
    border-radius: 10px;
  }
  .simplebar-vertical {
    margin-top: 10px;
    width: 2px;
    background: transparent;
    margin-right: -5px;
  }
`

export const SelectedMutationBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 2px 6px;
  cursor: pointer;
  align-items: center;
`

export const SelectedMutationInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 181px;
`
export const SelectedMutationDescription = styled.div`
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  line-height: 149%;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
  display: inline-block;
`

export const SelectedMutationId = styled.div`
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
  display: inline-block;
`

export const OpenListDefault = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @keyframes rotateIsClose {
    0% {
      transform: rotate(180deg);
    }

    50% {
      transform: rotate(90deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
  animation: rotateIsClose 0.2s ease forwards;
  transition: all 0.3s;
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`

export const OpenList = styled.span`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  @keyframes rotateIsOpen {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(90deg);
    }

    100% {
      transform: rotate(180deg);
    }
  }
  animation: rotateIsOpen 0.2s ease forwards;
  transition: all 0.3s;
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`
export const InfoWrapper = styled.span`
  cursor: pointer;
  display: inline-block;
  padding-top: 4px;
`

export const StarSelectedMutationWrapper = styled.span`
  cursor: pointer;
  display: inline-block;
  padding-top: 4px;
`

export const MutationsList = styled.div`
  position: absolute;
  z-index: 3;

  display: flex;
  flex-direction: column;

  padding: 6px;
  padding-top: 0;

  background: #fff;
  box-shadow: 0 4px 5px rgb(45 52 60 / 10%), 0 4px 20px rgb(11 87 111 / 15%);

  width: 294px;
  box-sizing: border-box;
  left: -3.5px;
  top: 38px;
  border-radius: 0px 0px 10px 10px;
  max-height: 500px;

  overflow: hidden;

  gap: 10px;
  @keyframes listVisible {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }
  animation: listVisible 0.2s ease forwards;
  transition: all 0.3s;
`
export const ButtonListBlock = styled.div`
  display: flex;
  border-radius: 0px, 0px, 10px, 10px;
  height: 41px;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  &::before {
    content: '';
    width: 294px;
    position: absolute;
    top: 0;
    left: -6px;
    background: #f8f9ff;
    height: 100%;
    z-index: 0;
  }
`

export const ButtonBack = styled.div`
  display: flex;
  background: #f8f9ff;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
  color: #7a818b;
  cursor: pointer;
  z-index: 1;
  width: 40%;
  svg {
    margin-right: 5px;
  }
`

export const ButtonMutation = styled.div`
  display: flex;
  background: #f8f9ff;
  align-items: center;
  justify-content: center;
  color: #384bff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
  cursor: pointer;
  z-index: 1;
  width: 40%;
  svg {
    margin-left: 5px;
  }
`

export const ListMutations = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
`

export const InputBlock = styled.div<{ $enable?: string; $enableBefore?: string }>`
  display: flex;

  padding: 2px 4px;
  cursor: pointer;

  align-items: center;
  box-sizing: border-box;
  width: 100%;

  background: ${(props) => props.$enable || '#fff'};
  border-radius: 4px;

  .inputMutation {
    background: ${(props) => props.$enable || '#fff'};
  }

  &:hover {
    background: rgba(248, 249, 255, 1);
  }
`
export const InputIconWrapper = styled.span`
  display: inline-block;
  padding-right: 3px;
  svg {
    margin-top: 5px;
  }
`

export const InputInfoWrapper = styled.div`
  display: flex;

  padding: 4px;
  padding-left: 6px;
  cursor: pointer;

  position: relative;

  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  .inputMutationSelected {
    color: rgba(34, 34, 34, 1);
  }
  .authorMutationSelected {
    color: #384bff;
  }
`
export const ImageBlock = styled.div`
  width: 30px;
  height: 30px;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`

export const AvalibleMutations = styled.div<{ $enable?: string; $enableBefore?: string }>`
  width: 100%;
  background: rgba(248, 249, 255, 1);
  border-radius: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10px;
  .avalibleMutationsInput {
    background: rgba(248, 249, 255, 1);
    margin-left: 10px;
    width: 250px;
    border-radius: 4px;
    padding: 2px 4px;
    margin-bottom: 3px;
  }
`

export const AvalibleLableBlock = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  width: 100%;
  .iconRotate {
    svg {
      transform: rotate(0deg);
    }
  }
`

export const AvalibleLable = styled.span`
  font-family: Roboto;
  font-size: 8px;
  font-weight: 700;
  line-height: 8px;
  text-transform: uppercase;
  color: #7a818b;
`

export const AvalibleArrowBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    margin-left: 10px;
    transform: rotate(180deg);
  }
`

export const AvalibleArrowLable = styled.span`
  font-family: Roboto;
  font-size: 8px;
  font-weight: 700;
  line-height: 11.92px;

  color: #7a818b;
`

export const InputMutation = styled.span`
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  line-height: 149%;

  color: rgba(34, 34, 34, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
  display: inline-block;
`

export const AuthorMutation = styled.div`
  font-family: 'Segoe UI', sans-serif;

  font-size: 10px;
  line-height: 100%;
  color: rgba(34, 34, 34, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
  display: inline-block;
`
