import React from "react";
import * as Icons from "../../../../../libs/icons";
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style";

/**
 * Summary card that highlights notable stat from identified label
 */
const LabelSummaryCard = ({ labeltype, websiteTotal }) => {
  return (
    <SContainer labeltype={labeltype}>
      <SHeader>
        <STotal>{websiteTotal}</STotal>
        <SLabel>
          {Icons.getLabelIcon(labeltype)}
          {labeltype.charAt(0).toUpperCase() + labeltype.slice(1)}
        </SLabel>
      </SHeader>
      <SFooter>Companies collected {labeltype} data.</SFooter>
    </SContainer>
  );
};

/**
 * List of Summary cards given label and stat {label:stat}
 */

const LabelSummaryCardList = ({ labels }) => {
  const entries = Object.entries(labels);
  const excludedLabels = labels.excludedLabels;
  return entries.map(([labeltype, evidence]) => {
    if (!excludedLabels.includes(labeltype) && labeltype != "excludedLabels") {
      let numOfWebsites = 0;
      Object.values(evidence).forEach(
        (website) => (numOfWebsites += Object.keys(website).length)
      );
      return (
        <LabelSummaryCard
          key={labeltype}
          labeltype={labeltype}
          websiteTotal={numOfWebsites}
        />
      );
    }
  });
};

export default LabelSummaryCardList;
