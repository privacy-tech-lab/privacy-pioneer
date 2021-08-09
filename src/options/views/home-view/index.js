/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router"
import { getWebsites, getLabels } from "../../../libs/indexed-db/getIdbData.js"
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

/**
 * Home page view containing overview and recently identified labels
 */
const HomeView = () => {
  const history = useHistory()
  const [websites, setWebsites] = useState({})
  const [labels, setLabels] = useState({})
  const [modal, setModal] = useState({ show: false })
  const entries = Object.entries(websites)
  useEffect(() => {
    getWebsites().then((websites) => {
      setWebsites(websites)
      getLabels().then((labels) => {
        setLabels(labels)
        ReactTooltip.rebuild()
      }),
        document
          .getElementById("detail-modal")
          .addEventListener("hidden.bs.modal", () => {
            setModal({ show: false })
          })
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
        <SContainer>
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
                history.push("/search")
                ReactTooltip.hide()
              }}
              data-place="left"
              data-tip="See all browsing history, including evidence originating from 3rd parties"
            >
              See All
            </SButtonText>
          </SSectionContainer>
          <WebsiteLabelList
            allLabels={labels}
            websites={websites}
            recent
            maxLength={entries.length > 3 ? 3 : entries.length}
            handleTap={handleTap}
          />
        </SContainer>
      </Scaffold>
      <HomeTour steps={homeSteps} />
    </React.Fragment>
  )
}

export default HomeView
