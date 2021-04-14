import React from "react"
import Scaffold from "../../components/scaffold"
import { STitle } from "./style"
import { SContainer, SSubtitle } from "./style"

const WatchlistView = () => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>Watchlist</STitle>
        <SSubtitle>
          Edit your watchlist so we can monitor personal information collected and shared between companies.
        </SSubtitle>
      </SContainer>
    </Scaffold>
  )
}

export default WatchlistView
