/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled, { css } from "styled-components"

export const SNavBar = styled.nav`
  display: flex;
  max-width: 1192px;
  width: calc(100% - 128px);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-left: 64px;
  margin-right: 64px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  background-color: var(--backgroundColor);
  z-index: 1;
  user-select: none;
`

export const SLeading = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

export const SLeadingContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

export const SBrandIcon = styled.img`
  margin-right: 16px;
  height: 36px;
  width: 36px;
`

export const SBrandTitle = styled.div`
  font-size: var(--headline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const STrailing = styled.div`
  display: flex;
  flex-direction: row;
`

export const SNavAction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 16px;
  cursor: pointer;
  font-weight: bold;
  svg {
    margin-right: 4px;
  }
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }

  ${(props) =>
    props.active
      ? css`
          color: var(--primaryHighlightColor);
          path,
          circle {
            fill: var(--primaryHighlightColor);
          }
        `
      : css`
          color: gray;
          path,
          circle {
            fill: gray;
          }
        `}
`
