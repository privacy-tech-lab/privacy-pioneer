import React from "react"
import NavigationBar from "../components/NavigationBar"
import Scaffold from "../components/Scaffold"
import { BackIcon } from "../../components/Icons"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import DomainLogo from "../../components/DomainLogo"
import Badge from "../../components/Badge"
import Seperator from "../../components/Seperator"
import DomainBadge from "../../components/DomainBadge"

const Leading = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  :hover {
    filter: brightness(0.75);
  }
  :active {
    filter: brightness(1.25);
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;

  .logo {
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .title {
    font-weight: bold;
  }
  .spacer {
    width: 16px;
  }
  .description {
    margin-top: 8px;
    color: var(--secondaryTextColor);
    font-size: var(--body2);
  }
  .badges {
    display: flex;
    flex-direction: row;
  }
`

const ThirdParty = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;

  .title {
    margin-top: 16px;
    font-weight: bold;
  }
  .spacer {
    width: 16px;
  }
  .description {
    margin-top: 8px;
    color: var(--secondaryTextColor);
    font-size: var(--body2);
  }
  .item {
    display: flex;
    flex-direction: column;
  }
  .badges {
    display: flex;
    flex-direction: row;
  }
`

export default () => {
  const history = useHistory()
  //console.log(history)
  return (
    <Scaffold
      navigationBar={
        <NavigationBar
          leading={
            <Leading onClick={() => history.goBack()}>
              <BackIcon size="24px" />
            </Leading>
          }
          middle={"Location"}
        />
      }
      body={
        <Body>
          <Header>
            <div className="logo">
              <DomainLogo large domain={"Amazon"} />
            </div>
            <div className="spacer"></div>
            <div className="content">
              <div className="title">Amazon</div>
              <div className="description">Collects the following location data:</div>
              <div className="badges">
                <Badge>Coarse Location</Badge>
              </div>
            </div>
          </Header>
          <Seperator marginLeft="16px" marginRight="16px" />
          <ThirdParty>
            <div className="title">Third Parties</div>
            <div className="description">Amazon shared your location data with the following third parties.</div>
            <div className="item">
              <DomainBadge domain={"Google"} />
              <div className="badges">
                <Badge>Coarse Location</Badge>
                <Badge>Approximate Location</Badge>
              </div>
              <Seperator marginTop="16px" />
            </div>
            <div className="item">
              <DomainBadge domain={"Spotify"} />
              <div className="badges">
                <Badge>Coarse Location</Badge>
                <Badge>Approximate Location</Badge>
              </div>
              <Seperator marginTop="16px" />
            </div>
            <div className="item">
              <DomainBadge domain={"Facebook"} />
              <div className="badges">
                <Badge>Coarse Location</Badge>
                <Badge>Approximate Location</Badge>
              </div>
              <Seperator marginTop="16px" />
            </div>
          </ThirdParty>
        </Body>
      }
    />
  )
}
