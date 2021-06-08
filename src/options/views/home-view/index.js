import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { getWebsites, getLabels } from "../../../libs/indexed-db"
import Scaffold from "../../components/scaffold"
import WebsiteLabelList from "../../components/website-label-list"
import LabelSummaryCardList from "./components/label-summary-card"
import { SButtonText, SCardGroup, SContainer, SSectionContainer, SSubtitle, STitle } from "./style"

/**
 * Home page view containing overview and recently identified labels
 */
const HomeView = () => {
  const history = useHistory()
  const [websites, setWebsites] = useState({})
  const [labels, setLabels] = useState({})
  const entries = Object.entries(websites)

  useEffect(() =>
    getWebsites()
      .then((websites) => { setWebsites(websites), getLabels(websites).then(labels => setLabels(labels))}
  ), [])

  return (
    <Scaffold>
      <SContainer>
        <STitle>Overview</STitle>
        <SSubtitle>A summary of your privacy labels</SSubtitle>
        <SCardGroup>
          <LabelSummaryCardList labels={labels} />
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
