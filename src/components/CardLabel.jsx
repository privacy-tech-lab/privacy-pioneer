import React from "react"
import styled from "styled-components"
import DomainBadge from "./DomainBadge"
import { ChevronRightIcon, LocationIcon, PlusCircleIcon } from "./Icons"
import Seperator from "./Seperator"
import { useHistory } from "react-router-dom"

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--cardColor);
  max-width: 340px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HeaderLeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HeaderTitle = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

const HeaderTrailing = styled.div`
  height: 24px;
  width: 24px;
`

const Description = styled.div`
  color: var(--secondaryTextColor);
  font-size: var(--body2);
  margin-top: 8px;
`

const _More = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

const More = ({ count }) => (
  <_More>
    <PlusCircleIcon size="24px" />
    <span style={{ marginLeft: "8px" }}>{count} others</span>
  </_More>
)

export default ({ label }) => {
  const history = useHistory()
  return (
    <Card
      onClick={() =>
        history.push({
          pathname: "/info",
          state: { data: "hello world" },
        })
      }
    >
      <Header>
        <HeaderLeading>
          <LocationIcon size="24px" />
          <HeaderTitle>Location</HeaderTitle>
        </HeaderLeading>
        <HeaderTrailing>
          <ChevronRightIcon size="24px" />
        </HeaderTrailing>
      </Header>
      <Description>
        Amazon collected and shared your location data - <strong>Coarse Location</strong> with the following companies.
      </Description>
      <Seperator marginTop="16px" marginBottom="0px" />
      <DomainBadge domain="Facebook" />
      <DomainBadge domain="Google" />
      <More count={4} />
    </Card>
  )
}
