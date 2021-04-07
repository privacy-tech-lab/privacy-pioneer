import React from "react"
import styled from "styled-components"
import DomainBadge from "../../components/DomainBadge"
import { LocationIcon } from "../../components/Icons"
import Seperator from "../../components/Seperator"
import { useHistory } from "react-router-dom"

const Card = styled.div`
  margin-top: 16px;
  min-height: 128px;
  box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: var(--secondaryCardColor);
  display: flex;
  flex-direction: column;
  padding: 0px 16px 16px;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;

  .label-group {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
  }
`

const Label = styled.div`
  display: flex;
  border: 4px solid var(--seperatorColor);
  padding: 8px 16px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  .icon {
    margin-right: 4px;
  }
  .text {
  }
`

const ListItem = ({}) => {
  const history = useHistory()
  return (
    <Item
      onClick={() =>
        history.push({
          pathname: "/info",
          state: { data: "hello world" },
        })
      }
    >
      <DomainBadge domain="chartboost.com" />
      <div className="label-group">
        <Label>
          <div className="icon">
            <LocationIcon size="24px" />
          </div>
          <div className="text">Location</div>
        </Label>
        <Label>
          <div className="icon">
            <LocationIcon size="24px" />
          </div>
          <div className="text">Location</div>
        </Label>
      </div>
      <Seperator marginTop="16px" />
    </Item>
  )
}

const ListCard = () => {
  return (
    <Card>
      <ListItem />
      <ListItem />
    </Card>
  )
}

export default ListCard
