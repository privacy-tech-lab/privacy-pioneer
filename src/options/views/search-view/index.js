import React from "react"
import Scaffold from "../../components/scaffold"
import { SInput, SInputContainer, STitle } from "./style"
import { SContainer, SSubtitle } from "./style"
import * as Icons from "../../../libs/icons"
import WebsiteLabelList from "../../components/website-label-list"

const SearchView = () => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>History</STitle>
        <SSubtitle>See browsed webistes accessing and sharing your personal information</SSubtitle>
        <SInputContainer>
          <Icons.Search size="24px" />
          <SInput placeholder="Search" />
        </SInputContainer>
        <WebsiteLabelList websites={{}} />
      </SContainer>
    </Scaffold>
  )
}

export default SearchView
