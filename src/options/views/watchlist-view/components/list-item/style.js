/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components"

export const SItem = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  > * {
    :first-child {
      width: 50%;
    }
  }
  > * {
    :last-child {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
    }
  }
`

export const SKeyword = styled.div``

export const SType = styled.div``

export const SAction = styled.div`
  cursor: pointer;
  position: relative;
  display: inline-block;
`

export const SDropdownOptions = styled.div`
  right: 32px;
  top: -8;
  display: ${props => props.show ? 'flex' : 'none'};
  position: absolute;
  flex-direction: row;
  background-color: var(--textFieldColor);
  box-shadow: 0px 4px 16px -8px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  z-index: 2;
  > * {
    :first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }
  > * {
    :last-child {
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
`

export const SDropdownItem = styled.div`
  border: 1px solid var(--seperatorColor);
  padding: 8px;
  cursor: pointer;
  background-color: var(--textFieldColor);
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      filter: brightness(0.85);
    }
    :active {
      filter: brightness(1.15);
    }
  }
`