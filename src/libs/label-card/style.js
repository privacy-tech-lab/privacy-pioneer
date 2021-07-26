import styled from "styled-components"

export const SCard = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: space-between;
  background-color: var(--cardColor);
  width: ${(props) => (props.popup ? "340px" : "250px")};
  height: 140px;
  margin: ${(props) => props.margin};
  padding: 16px;
  border-radius: 16px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
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
export const SLogo = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const SHeaderLeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const SHeaderTitle = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export const SHeaderTrailing = styled.div`
  height: 24px;
  width: 24px;
`

export const SDescription = styled.div`
  color: var(--secondaryTextColor);
  font-size: var(--body2);
  margin-top: 8px;
`

export const SBadge = styled.div`
  /* border: 2px solid white; */
  background-color: var(--primaryBadgeColor);
  color: var(--tintTextColor);
  border-radius: 1em;
  text-align: center;
  justify-self: center;
  align-self: center;
  padding: 4px 8px;
  margin: 2px 4px;
  width: fit-content;
  font-weight: 600;
`

export const SMore = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 2px 4px;
  background-color: var(--primaryBrandTintColor);
  color: var(--tintTextColor);
  margin-left: 12px;
  font-size: var(--headline);
  path,
  circle {
    fill: var(--tintTextColor);
  }
`
