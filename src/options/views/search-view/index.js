/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { Modal } from "bootstrap";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import * as Icons from "../../../libs/icons";
import { searchInit } from "../../../libs/init";
import { seeAllSteps, SeeAllTour } from "../../../libs/tour";
import Scaffold from "../../components/scaffold";
import WebsiteLabelList from "../../components/website-label-list";
import LabelModal from "../home-view/components/detail-modal";
import FilterSearch from "./components/filter-search";
import {
  SBackButton,
  SContainer,
  SEmpty,
  SFiltersDiv,
  SSubtitle,
  STitle,
  STop,
} from "./style";

/**
 * location.region = undefined | [permission, websites]
 * Depending on if you came to this page from the See All
 * or clicking the large cards
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
  const history = useHistory();
  const location = useLocation();

  const [websites, setWebsites] = useState({});
  const [filteredWebsites, setFilteredWebsites] = useState({});
  const [labels, setLabels] = useState({});
  const [filteredLabels, setFilteredLabels] = useState({});
  const [showEmpty, setShowEmpty] = useState(false);
  const [touring, setTouring] = useState(false);
  const [modal, setModal] = useState({ show: false });

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"));
    setModal(items);
    modal.show();
  };

  useEffect(() => {
    searchInit({
      location,
      setTouring,
      setWebsites,
      setFilteredWebsites,
      setLabels,
      setFilteredLabels,
    });
  }, []);

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
  );
};

export default SearchView;
