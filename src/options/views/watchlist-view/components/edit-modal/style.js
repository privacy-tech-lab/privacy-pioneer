/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components"

export const SContent = styled.div`
  background-color: var(--cardColor);
  border-radius: 16px;
`

export const SModal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px 16px 16px;
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

export const SKeyword = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0px 4px;
`

export const SForm = styled.div`
  display: flex;
  flex-direction: column;
`

export const SInput = styled.input`
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 4px;
  width: 100%;
  background-color: var(--inputTextFieldColor);
  border-radius: 8px;
  border: 0px solid #eee;
  outline: none;
  font-size: var(--body1);
  color: var(--textColor);
  ::placeholder {
    color: var(--secondaryTextColor);
  }
`

export const SHeader = styled.div`
  margin-top: 24px;
  color: var(--secondaryTextColor);
  font-size: var(--body2);
`

export const SType = styled.div`
  display: flex;
  flex-direction: column;
`

export const SErrorText = styled.div`
  color: crimson;
  padding-top: 16px;
`

export const SDropdownOptions = styled.div`
  top: 56px;
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: var(--inputTextFieldColor);
  box-shadow: 0px 4px 16px -8px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  z-index: 3;
  > * {
    :first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  > * {
    :last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
`

export const SDropdownItem = styled.div`
  border: 1px solid var(--seperatorColor);
  padding: 16px;
  cursor: pointer;
  background-color: var(--inputTextFieldColor);

  .react-hint__content {
    padding: 10px;
    border-radius: 5px;
    background: var(--primaryBrandColor);
    text-align: center;
    width: max-content;
    max-width: 350px;
  }
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

export const SDropdown = styled.div`
  position: relative;
  display: inline-block;
`

export const SDropdownSelection = styled.div`
  cursor: pointer;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 4px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--inputTextFieldColor);
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

export const SActionGroup = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export const SAction = styled.div`
  color: ${(props) => props.color};
  margin-left: 16px;
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }
  cursor: pointer;
`
