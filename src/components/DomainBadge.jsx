import React from "react"
import DomainLogo from "./DomainLogo"
import styled from "styled-components"

const _DomainBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

export default ({domain}) => {
  return <_DomainBadge>
    <DomainLogo domain={domain} />
    <span style={{marginLeft: "8px"}}>{domain}</span>
  </_DomainBadge>
}
