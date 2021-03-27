import React from "react"
import styled from "styled-components"

const DomainLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.large ? "64px" : "24px"};
  width: ${(props) => props.large ? "64px" : "24px"};
  border-radius: 50%;
  background-color: var(--primaryBrandTintColor);
  color: var(--primaryBrandColor);
  font-weight: bold;
  font-size: ${(props) => props.large ? "32px" : "12px"};
  margin: ${(props) => props.margin ? props.margin : "0px"};
`

export default ({ domain, large, margin }) => {
  return <DomainLogo margin={margin} large={large}>{domain.charAt(0).toUpperCase()}</DomainLogo>
}
