import React from "react"
import NavigationBar from "../components/NavigationBar"
import Scaffold from "../components/Scaffold"
import logo from "../../assets/icon-48.png"
import styled from "styled-components"
import DomainLogo from "../../components/DomainLogo"
import CardLabel from "../../components/CardLabel"
import { RadarIcon, SettingsIcon } from "../../components/Icons"
import { useHistory } from "react-router-dom"

const Leading = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

const Trailing = styled.div`
  display: flex;
  flex-direction: row;

  .first-item {
    padding-right: 16px;
    padding-left: 8px;
  }
  .last-item {
    padding-left: 16px;
    padding-right: 8px;
  }
  div {
    :hover {
      filter: brightness(0.75);
    }
    :active {
      filter: brightness(1.25);
    }
  }
`

const BrandIcon = styled.img.attrs(() => ({ alt: "Logo", src: logo }))`
  height: 36px;
  width: 36px;
  margin-left: 16px;
  margin-right: 16px;
`

const BrandTitle = styled.div`
  font-size: var(--headline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Body = styled.main`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  font-weight: bold;
  font-size: var(--title2);
  margin-top: 8px;
`

const Subtitle = styled.div`
  margin-top: 4px;
  font-size: var(--body2);
  color: var(--secondaryTextColor);
`

export default () => {
  const history = useHistory()
  return (
    <Scaffold
      navigationBar={
        <NavigationBar
          leading={
            <Leading>
              <BrandIcon /> <BrandTitle>Integrated Privacy Analysis</BrandTitle>
            </Leading>
          }
          trailing={
            <Trailing>
              <div
                onClick={() =>
                  history.push({
                    pathname: "/watchlist",
                    state: { data: "hello world" },
                  })
                }
                className="last-item"
              >
                <RadarIcon size="24px" />
              </div>
              <div onClick={() => browser.runtime.openOptionsPage()} className="first-item">
                <SettingsIcon size="24px" />
              </div>
            </Trailing>
          }
        />
      }
      body={
        <Body>
          <Header>
            <DomainLogo large margin={"16px 0px 0px 0px"} domain={"amazon"} />
            <Title>www.amazon.com</Title>
            <Subtitle>3 privacy practices Identified</Subtitle>
          </Header>
          <CardLabel label="location" />
          <CardLabel label="location" />
        </Body>
      }
    />
  )
}
