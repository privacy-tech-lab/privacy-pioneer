import React from "react"
import styled from "styled-components"

const Nav = styled.nav`
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
  ${(props) => !props.middle && "justify-content: space-between;" }
  max-width: 100%;

  .middle {
    display: flex;
    justify-content: center;
    min-width: 0;
  }

  .leading {
    flex: 1;
    display: flex;
    justify-content: left;
    min-width: 0;
  }

  .trailing {
    ${(props) => props.middle && "flex: 1;" }
    display: flex;
    justify-content: right;
    min-width: 0;
  }
`

export default ({ leading, middle, trailing }) => {
  return (
    <Nav middle={middle}>
      {leading && <div className="leading">{leading}</div>}
      {middle && <div className="middle">{middle}</div>}
      {(trailing || middle) && <div className="trailing">{trailing}</div>}
    </Nav>
  )
}
