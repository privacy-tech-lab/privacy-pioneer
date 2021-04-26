import styled from "styled-components"
import logo from "../../../assets/icon-48.png"

export const SLeading = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

export const STrailing = styled.div`
  display: flex;
  flex-direction: row;

  > * {
    :first-child {
      padding-right: 4px;
      padding-left: 8px;
    }
  }
  > * {
    :last-child {
      padding-left: 4px;
      padding-right: 8px;
    }
  }
`

export const SIconWrapper = styled.div`
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }
`

export const SBrandIcon = styled.img.attrs(() => ({ alt: "Logo", src: logo }))`
  height: 36px;
  width: 36px;
  margin-left: 16px;
  margin-right: 16px;
`

export const SBrandTitle = styled.div`
  font-size: var(--headline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SBody = styled.main`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

export const SHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const STitle = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  font-weight: bold;
  font-size: var(--title2);
  margin-top: 8px;
  text-align: center;
`

export const SSubtitle = styled.div`
  margin-top: 4px;
  font-size: var(--body2);
  color: var(--secondaryTextColor);
`
