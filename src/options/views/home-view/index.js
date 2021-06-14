import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getWebsites, getLabels } from "../../../libs/indexed-db";
import Scaffold from "../../components/scaffold";
import WebsiteLabelList from "../../components/website-label-list";
import LabelSummaryCardList from "./components/label-summary-card";
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
  const [labels, setLabels] = useState({});
  const entries = Object.entries(websites);

  useEffect(
    () =>
      getWebsites().then((websites) => {
        setWebsites(websites),
          getLabels(websites).then((labels) => setLabels(labels));
      }),
    []
  );
  // sorts websites by amount of labels it contains
  //structure of entries: [..."website name": [array of labels]]
  const sortedWebsites = Object.fromEntries(
    entries.slice(0, entries.length > 6 ? 5 : entries.length).sort((a, b) => {
      if (a[1].length < b[1].length) {
        return 1;
      } else if (a[1].length > b[1].length) {
        return -1;
      } else {
        return 0;
      }
    })
  );

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
            <SSubtitle>
              See companies who recently collected or shared personal
              information
            </SSubtitle>
          </div>
          <SButtonText onClick={() => history.push({ pathname: "/search" })}>
            See All
          </SButtonText>
        </SSectionContainer>
        <WebsiteLabelList
          websites={sortedWebsites}
          maxLength={entries.length > 6 ? 5 : entries.length}
        />
      </SContainer>
    </Scaffold>
  );
};

export default HomeView;
