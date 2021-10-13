/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

//styling for Detail Modal Compoenent

import styled from "styled-components"

export const SContainer = styled.div``

export const SDialog = styled.div``

export const SContent = styled.div`
  background-color: var(--cardColor);
  border-radius: 16px;
`

export const SModal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px 16px 8px;
  background-color: var(--cardColor);
  border-radius: 16px;
`

export const SNavigationBar = styled.div`
  display: flex;
  min-height: 56px;
  height: 56px;
  flex-direction: row;
  border-bottom: 1px solid var(--seperatorColor);
  width: 100%;
  align-items: center;
  max-width: 100%;
`

export const SMiddle = styled.div`
  display: flex;
  justify-content: center;
  min-width: 0;
  flex-direction: row;
  align-items: center;
`

export const STitle = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export const SLeading = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
  min-width: 0;
`

export const STrailing = styled.div`
  flex: 1;
  display: flex;
  justify-content: right;
  min-width: 0;
`

export const IconWrapper = styled.div`
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }
  cursor: pointer;
`
