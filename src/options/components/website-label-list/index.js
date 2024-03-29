/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import WebsiteBadge from "../../../libs/components/website-badge";
import LabelCard from "../../../libs/components/label-card";
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style";
import { getAnalyticsStatus } from "../../../libs/indexed-db/settings";
import { handleClick } from "../../../libs/indexed-db/getAnalytics";
import { settingsModelsEnum } from "../../../background/analysis/classModels";

/**
 * Makes label cards for a given website
 * @param {object} obj
 * @param {string} obj.website the host website
 * @param {function(object):void} obj.handleTap function that handles clicking on the cards
 * @param {object} obj.allLabels
 * @param {object} obj.webLabels
 */
const LabelCards = ({ website, handleTap, allLabels, webLabels }) => {
  return webLabels.map((label, index) => {
    var requests = "hide";
    if (Object.entries(allLabels).length == 0) {
      requests = "empty";
    } else {
      if (label in allLabels && website in allLabels[label]) {
        requests = allLabels[label][website];
      }
    }

    if (requests == "hide") {
      return null;
    }

    return (
      <LabelCard
        key={index}
        onTap={() => {
          handleTap({ label, requests, website, show: true });
          const getAnalysis = async () => {
            const status = await getAnalyticsStatus();
            if (status == true) {
              handleClick(
                "History Label Card (including Recents): " +
                  label.toString() +
                  " Website: " +
                  website.toString(),
                "History/Recent",
                website.toString(),
                settingsModelsEnum.notApplicable,
                settingsModelsEnum.notApplicable
              ); /* Label Card from History/Recent */
            }
          };
          getAnalysis();
        }}
        margin="8px 16px 0px 0px"
        label={label}
        requests={requests}
        website={website}
      />
    );
  });
};

/**
 * Displays a list of websites and a quick summary of their privacy labels
 * @param {object} obj
 * @param {object} obj.websites All websites we have evidence for
 * @param {boolean} [obj.recent]
 * @param {function(object):void} obj.handleTap
 * @param {object} obj.allLabels
 */
export const WebsiteLabelList = ({ websites, recent, handleTap, allLabels }) => {
  const entries = Object.entries(websites);
  return (
    <SContainer>
      {entries
        .slice(0, recent && (entries.length > 3) ? 3 : entries.length)
        .map(([website, data]) => (
          <SItem
            key={website}
            // CHECK
            hasEvidence={Object.keys(data.labels).length != 0}
          >
            <WebsiteBadge website={website} party={data.party} />
            <SLabelGroup>
              <LabelCards
                website={website}
                handleTap={handleTap}
                allLabels={allLabels}
                webLabels={data.labels}
              />
            </SLabelGroup>
            <SSeperator marginTop="16px" />
          </SItem>
        ))}
    </SContainer>
  );
};
