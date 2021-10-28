import styled from "styled-components"

//styling for filters component

export const SFilterRow = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
  width: fit-content;
`

export const SFilterRowItem = styled.div`
  font-weight: bold;
  user-select: none;
  margin-top: 2px;
  margin-right: 2px;
  padding: 4px;
  cursor: pointer;
  opacity: ${(props) => (props.highlight ? 1 : 0.6)};
`
export const SCompaniesButton = styled.div`
  background-color: #9b45d9;
  color: #ffffff;
  border-radius: 5px;
  padding: 5px;
`
