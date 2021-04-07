import React from "react"
import styled from "styled-components"
import Scaffold from "../components/Scaffold"
import DomainLogo from "../../components/DomainLogo"
import CardLabel from "../../components/CardLabel"

const Header = styled.div`
  display: flex;
  flex-direction: row;
  .icon {
    margin-right: 16px;
  }
  .text {
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: var(--title1);
    font-weight: bold;
  }
  .description {
    color: var(--secondaryTextColor);
  }
`

const Labels = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`

export default () => {
  return (
    <Scaffold>
      <Header>
        <div className="icon">
          <DomainLogo large domain={"Amazon"} />
        </div>
        <div className="text">
          <div className="title">Amazon</div>
          <div className="description">The following pravicy practices were identified from www.amazon.com</div>
        </div>
      </Header>
      <Labels>
        <CardLabel label="location" />
        <CardLabel label="location" />
      </Labels>
    </Scaffold>
  )
}
