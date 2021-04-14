import styled from "styled-components"

export const SNav = styled.nav`
  display: flex;
  min-height: 56px;
  height: 56px;
  flex-direction: row;
  border-bottom: 1px solid var(--seperatorColor);
  background-color: var(--backgroundColor);
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  width: 100%;
  align-items: center;
  ${(props) => !props.middle && "justify-content: space-between;"}
  max-width: 100%;
`

export const SMiddle = styled.div`
  display: flex;
  justify-content: center;
  min-width: 0;
`

export const SLeading = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
  min-width: 0;
`

export const STrailing = styled.div`
  ${(props) => props.middle && "flex: 1;"}
  display: flex;
  justify-content: right;
  min-width: 0;
`
