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

export const SInput = styled.input`
  padding-top: 8px;
  padding-left: 36px;
  padding-right: 8px;
  padding-bottom: 8px;
  margin-top: 32px;
  width: 50%;
  background-color: var(--cardColor);
  border-radius: 8px;
  border: 0px solid #eee;
  outline: none;
  font-size: var(--body1);
  color: var(--textColor);

  ::placeholder {
    color: var(--secondaryTextColor);
  }
`

export const SInputContainer = styled.div`
  path,
  circle {
    fill: var(--secondaryTextColor);
  }
  svg {
    margin-top: 36px;
    margin-left: 8px;
    position: absolute;
  }
`
