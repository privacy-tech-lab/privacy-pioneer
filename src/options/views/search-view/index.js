/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import {
  SBackButton,
  STitle,
  STop,
  SEmpty,
  SFiltersDiv,
  SContainer,
  SSubtitle,
} from "./style"
import * as Icons from "../../../libs/icons"
import { Modal } from "bootstrap"
import LabelModal from "../home-view/components/detail-modal"
import WebsiteLabelList from "../../components/website-label-list"
import { useHistory, useLocation } from "react-router"
import { seeAllSteps, SeeAllTour } from "../../../libs/tour"
import { searchInit } from "../../../libs/init"
import FilterSearch from "./components/filter-search"

/**
 * location.state = undefined | [permission, websites]
 * Depending on if you came to this page from the See All
 * or clicking the large cards
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
  const history = useHistory()
  const location = useLocation()

  const [modal, setModal] = useState({ show: false })

  const [websites, setWebsites] = useState(
    location.state ? location.state.websites ?? {} : {}
  ) // pass websites from previous page if possible
  const [filteredWebsites, setFilteredWebsites] = useState(
    location.state ? location.state.websites ?? {} : {}
  )

  const [labels, setLabels] = useState(
    location.state ? location.state.labels ?? {} : {}
  )
  const [filteredLabels, setFilteredLabels] = useState(
    location.state ? location.state.labels ?? {} : {}
  )

  const [showEmpty, setShowEmpty] = useState(false)
  const [touring, setTouring] = useState(false)

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  useEffect(() => {
    searchInit({
      setTouring,
      setWebsites,
      setFilteredWebsites,
      setFilteredLabels,
      setLabels,
      websites: websites,
    })
  }, [])

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
          <STop>
            <SBackButton
              onClick={() => history.goBack()}
              whileHover={{ scale: 1.2 }}
            >
              <Icons.Arrow size={18} />
            </SBackButton>
            <STitle>History</STitle>
          </STop>
          <SSubtitle>
            See browsed websites accessing and sharing your personal information
          </SSubtitle>
          <SFiltersDiv id="filtersTour">
            <FilterSearch
              setFilteredLabels={setFilteredLabels}
              filteredLabels={filteredLabels}
              labels={labels}
              websites={websites}
              setFilteredWebsites={setFilteredWebsites}
              setShowEmpty={setShowEmpty}
              location={location}
            />
          </SFiltersDiv>
          <WebsiteLabelList
            websites={filteredWebsites}
            allLabels={filteredLabels}
            handleTap={handleTap}
          />
          <SEmpty show={showEmpty}>
            {" "}
            No search results. Try changing the filter.{" "}
          </SEmpty>
        </SContainer>
      </Scaffold>
      {touring ? <SeeAllTour steps={seeAllSteps} /> : null}
    </React.Fragment>
  )
}

export default SearchView
