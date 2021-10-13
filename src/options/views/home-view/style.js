/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

//styling for Home View
import styled from "styled-components"

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
`

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`

export const SCardGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const SSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const SButtonText = styled.div`
  cursor: pointer;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  color: var(--primaryBrandColor);
  background-color: var(--primaryBrandTintColor);
  padding: 8px 16px 8px 16px;
  font-weight: bold;
  margin: 0px 8px;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  user-select: none;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`
