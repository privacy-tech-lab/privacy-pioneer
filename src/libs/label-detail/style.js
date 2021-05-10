import styled from "styled-components"

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const SHeaderBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

export const SHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`

export const SContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const SSpacer = styled.div`
  width: 16px;
`

export const STitle = styled.div`
  font-weight: bold;
`

export const SDescription = styled.div`
  margin-top: 8px;
  color: var(--secondaryTextColor);
  font-size: var(--body2);
`

export const SThirdParty = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
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

export const SItem = styled.div`
  display: flex;
  flex-direction: column;
`