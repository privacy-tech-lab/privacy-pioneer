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
