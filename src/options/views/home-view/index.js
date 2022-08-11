/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import Scaffold from "../../components/scaffold"
import WebsiteLabelList from "../../components/website-label-list"
import LabelSummaryCardList from "./components/label-summary-card"
import LabelModal from "../home-view/components/detail-modal"
import { Modal } from "bootstrap"
import ReactTooltip from "react-tooltip"
import {
  SButtonText,
  SCardGroup,
  SContainer,
  SSectionContainer,
  SSubtitle,
  STitle,
} from "./style"
import { HomeTour, homeSteps } from "../../../libs/tour/index.js"
import { homeInit } from "../../../libs/init.js"

/**
 * Home page view containing overview and recently identified labels
 * grabs from the DB to populate the page
 */
const HomeView = () => {
  const history = useHistory()
  const [websites, setWebsites] = useState({})
  const [labels, setLabels] = useState({})
  const [modal, setModal] = useState({ show: false })
  const [touring, setTouring] = useState(false)

  const entries = Object.entries(websites)

  useEffect(() => {
    ReactTooltip.hide()
    homeInit({
      setTouring,
      setLabels,
      setModal,
      setWebsites,
    })
  }, [])

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  return (
    <React.Fragment>
      <LabelModal
        label={modal.label}
        requests={modal.requests}
        website={modal.website}
        show={modal.show}
      />
      <Scaffold>
        <SContainer id="summaryTour">
          <STitle>Overview</STitle>
          <SSubtitle>A summary of your privacy labels</SSubtitle>
          <SCardGroup>
            <LabelSummaryCardList labels={labels} passWebsites={websites} />
          </SCardGroup>
        </SContainer>
        <SContainer marginTop>
          <SSectionContainer>
            <div>
              <STitle>Recent</STitle>
              <SSubtitle>
                See companies who recently collected or shared personal
                information
              </SSubtitle>
            </div>
            <SButtonText
              onClick={() => {
                history.push({
                  pathname: "/search",
                  region: { websites: websites, labels: labels },
                })
                ReactTooltip.hide()
              }}
              data-place="left"
              data-tip="See all browsing history, including evidence originating from 3rd parties"
              id="seeAllTour"
            >
              See All
            </SButtonText>
          </SSectionContainer>
          <div id="websitesTour">
            <WebsiteLabelList
              allLabels={labels}
              websites={websites}
              recent
              maxLength={entries.length > 3 ? 3 : entries.length}
              handleTap={handleTap}
            />
          </div>
        </SContainer>
      </Scaffold>
      {touring ? <HomeTour steps={homeSteps} /> : null}
    </React.Fragment>
  )
}

export default HomeView
