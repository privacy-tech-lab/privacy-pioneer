import React from "react"
import NavigationBar from "../components/NavigationBar"
import Scaffold from "../components/Scaffold"
import { BackIcon } from "../../components/Icons"
import styled from "styled-components"
import { useHistory } from "react-router-dom"

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
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  padding-top: 16px;

  .description {
    font-size: var(--body2);
    color: var(--secondaryTextColor);
  }

  input {
    padding-top: 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 8px;
    margin-top: 16px;
    width: 100%;
    background-color: var(--cardColor);
    border-radius: 8px;
    border: 0px solid #eee;
    outline: none;
    font-size: var(--body1);
    color: var(--textColor);
  }

  input::placeholder {
    color: var(--secondaryTextColor);
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
          middle={"Watchlist"}
        />
      }
      body={
        <Body>
          <div className="description">
            Edit your watchlist so we can monitor personal information collected and shared between companies.
          </div>
          <div>
            <input type="text" placeholder="johndoe@gmail.com" />
          </div>
        </Body>
      }
    />
  )
}
