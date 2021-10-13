import styled from "styled-components"

//styling for search bar component

export const SInput = styled.input`
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  width: 500px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 30px;
  background-color: var(--cardColor);
  border-radius: 6px;
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
    margin-top: 5px;
    padding-left: 5px;
    vertical-align: baseline;
    position: absolute;
  }
`
export const SSearchContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: left;
`
