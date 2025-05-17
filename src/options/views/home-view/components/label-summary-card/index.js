/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import {
  privacyLabels,
  settingsModelsEnum,
} from "../../../../../background/analysis/classModels";
import * as Icons from "../../../../../libs/icons";
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style";
import { useNavigate } from 'react-router-dom'
import ReactTooltip from "react-tooltip";
import { getAnalyticsStatus } from "../../../../../libs/indexed-db/settings";
import { handleClick } from "../../../../../libs/indexed-db/getAnalytics";

/**
 * Summary card that highlights notable stats from identified label
 * namely it regions how many websites you have visited have used that label
 * @param {object} obj
 * @param {string} obj.labeltype
 * @param {number} obj.websiteTotal
 * @param {object} obj.passWebsites
 * @param {object} obj.passLabels
 */
const LabelSummaryCard = ({
  labeltype,
  websiteTotal,
  passWebsites,
  passLabels,
}) => {
  const navigate = useNavigate();
  return (
    <SContainer
      labeltype={labeltype}
      data-place="bottom"
      data-tip={privacyLabels[labeltype]["description"]}
      onClick={() => {
        navigate("/search", {
          state: {
            region: {
              labeltype: labeltype,
              websites: passWebsites,
              labels: passLabels,
            },
          },
        });
        const getAnalysis = async () => {
          const status = await getAnalyticsStatus();
          if (status == true) {
            handleClick(
              "Overview Label: " + labeltype.toString(),
              "Home",
              settingsModelsEnum.notApplicable,
              settingsModelsEnum.notApplicable,
              labeltype.toString() + " Only"
            ); /*Overview Summary Label Added*/
          }
        };
        getAnalysis();
        ReactTooltip.hide();
      }}
    >
      <SHeader>
        <STotal>{websiteTotal}</STotal>
        <SLabel>
          {Icons.getLabelIcon(labeltype)}
          {labeltype.charAt(0).toUpperCase() + labeltype.slice(1)}
        </SLabel>
      </SHeader>
      <SFooter>Collection/Sharing of {labeltype.charAt(0).toUpperCase() + labeltype.slice(1)} Data.</SFooter>
    </SContainer>
  );
};

/**
 * List of Summary cards given label and stat {label:stat}
 * @param {object} obj
 * @param {object} obj.labels label and stat {label:stat} object
 * @param {object} obj.passWebsites
 */
export const LabelSummaryCardList = ({ labels, passWebsites }) => {
  const entries = Object.entries(labels);
  return entries.map(([labeltype, evidence]) => {
    let numOfWebsites = 0;
    Object.values(evidence).forEach(
      (website) => (numOfWebsites += Object.keys(website).length)
    );
    return (
      <LabelSummaryCard
        key={labeltype}
        labeltype={labeltype}
        websiteTotal={numOfWebsites}
        passWebsites={passWebsites}
        passLabels={labels}
      />
    );
  });
};
