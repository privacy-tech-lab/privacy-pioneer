import styled from "styled-components"

export const SContainer = styled.div`
  margin-top: 16px;
  min-height: 128px;
  display: flex;
  flex-direction: column;
`

export const SItem = styled.div`
  margin-left: -16px;
  padding-left: 16px;
  padding-right: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundColor);
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

export const SLabelGroup = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
`

export const SLabel = styled.div`
  display: flex;
  background-color: var(--cardColor);
  padding: 8px 16px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  svg:first-of-type {
    margin-right: 4px;
  }
`

export const SSeperator = styled.div`
  display: flex;
  height: 1px;
  margin-left: ${(prop) => prop.marginLeft};
  margin-right: ${(prop) => prop.marginRight};
  background-color: var(--seperatorColor);
  margin-top: ${(prop) => prop.marginTop};
  margin-bottom: ${(prop) => prop.marginBottom};
`
