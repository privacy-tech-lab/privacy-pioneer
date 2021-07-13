import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getWebsites, getLabels } from "../../../libs/indexed-db";
import Scaffold from "../../components/scaffold";
import WebsiteLabelList from "../../components/website-label-list";
import LabelSummaryCardList from "./components/label-summary-card";
import LabelModal from "../home-view/components/detail-modal";
import { Modal } from "bootstrap";

import {
  SButtonText,
  SCardGroup,
  SContainer,
  SSectionContainer,
  SSubtitle,
  STitle,
} from "./style";

/**
 * Home page view containing overview and recently identified labels
 */
const HomeView = () => {
  const history = useHistory();
  const [websites, setWebsites] = useState({});
  const [labelsCard, setLabelsCard] = useState({});
  const [labels, setLabels] = useState({});
  const [modal, setModal] = useState({ show: false });
  const entries = Object.entries(websites);

  useEffect(
    () =>
      getWebsites().then((websites) => {
        setWebsites(websites);
        getLabels().then((labels) => {
          setLabels(labels.byWebsite);
          setLabelsCard(labels.numOfEachLabel);
        }),
          document
            .getElementById("detail-modal")
            .addEventListener("hidden.bs.modal", () => {
              setModal({ show: false });
            });
      }),
    []
  );

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"));
    setModal(items);
    modal.show();
  };

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
            <LabelSummaryCardList labels={labelsCard} />
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
              onClick={() =>
                history.push({
                  pathname: "/search",
                  state: [websites, labels], //fixes race condition bug by passing this information to next page
                })
              }
            >
              See All
            </SButtonText>
          </SSectionContainer>
          <WebsiteLabelList
            labels={labels}
            websites={websites}
            maxLength={entries.length > 6 ? 5 : entries.length}
            handleTap={handleTap}
          />
        </SContainer>
      </Scaffold>
    </React.Fragment>
  );
};

export default HomeView;
