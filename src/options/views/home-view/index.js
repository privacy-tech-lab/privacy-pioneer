import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { getWebsites } from "../../../libs/indexed-db"
import Scaffold from "../../components/scaffold"
import WebsiteLabelList from "../../components/website-label-list"
import LabelSummaryCard from "./components/label-summary-card"
import { SButtonText, SCardGroup, SContainer, SSectionContainer, SSubtitle, STitle } from "./style"

const HomeView = () => {
  const history = useHistory()
  const [websites, setWebsites] = useState({})
  const entries = Object.entries(websites)

  useEffect(() => {
    getWebsites().then((websites) => setWebsites(websites))
  }, [])

  return (
    <Scaffold>
      <SContainer>
        <STitle>Overview</STitle>
        <SSubtitle>A summary of your privacy labels</SSubtitle>
        <SCardGroup>
          <LabelSummaryCard color="orange" />
          <LabelSummaryCard color="purple" />
        </SCardGroup>
      </SContainer>
      <SContainer marginTop>
        <SSectionContainer>
          <div>
            <STitle>Recent</STitle>
            <SSubtitle>See companies who recently collected or shared personal information</SSubtitle>
          </div>
          <SButtonText onClick={() => history.push({ pathname: "/search" })}>See All</SButtonText>
        </SSectionContainer>
        <WebsiteLabelList websites={websites} maxLength={entries.length > 6 ? 5 : entries.length} />
      </SContainer>
    </Scaffold>
  )
}

export default HomeView
