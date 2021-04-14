import React from "react"
import Scaffold from "../../components/scaffold"
import * as Icons from "../../../libs/icons"
import { useHistory } from "react-router-dom"
import { SLeading, SBody, SDescription, SInput } from "./style"
import NavBar from "../../components/nav-bar"

const WatchlistView = () => {
  const history = useHistory()
  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading onClick={() => history.goBack()}>
              <Icons.Back size="24px" />
            </SLeading>
          }
          middle={"Watchlist"}
        />
      }
      body={
        <SBody>
          <SDescription>
            Edit your watchlist so we can monitor personal information collected and shared between companies.
          </SDescription>
          <SInput type="text" placeholder="johndoe@gmail.com" />
        </SBody>
      }
    />
  )
}

export default WatchlistView
