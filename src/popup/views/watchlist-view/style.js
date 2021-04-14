import styled from "styled-components"

export const SLeading = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }
`

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  padding-top: 16px;
`

export const SDescription = styled.div`
  font-size: var(--body2);
  color: var(--secondaryTextColor);
`

export const SInput = styled.input`
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 8px;
  margin-top: 16px;
  width: 100%;
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
