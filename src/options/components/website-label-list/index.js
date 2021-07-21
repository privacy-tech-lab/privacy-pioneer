import React from "react";
import WebsiteBadge from "../../../libs/website-badge";
import LabelCard from "../../../libs/label-card";
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style";

/**
 * Makes label cards for a given website
 */

const LabelCards = ({ website, handleTap, allLabels, webLabels }) => {
  return webLabels.map((label, index) => {
    try {
      const requests = allLabels[label][website];
      return (
        <LabelCard
          key={index}
          onTap={() => {
            handleTap({ label, requests, website, show: true });
          }}
          margin="8px 16px 0px 0px"
          label={label}
          requests={requests}
          website={website}
          excludedLabels={allLabels["excludedLabels"]}
        />
      );
    } catch {
      return null;
    }
  });
};

/**
 * Displays a list of websites and a quick summary of their privacy labels
 */

const WebsiteLabelList = ({ websites, maxLength, handleTap, allLabels }) => {
  const entries = Object.entries(websites);

  return (
    <SContainer>
      {entries
        .slice(0, maxLength ?? entries.length)
        .map(([website, webLabels]) => (
          <SItem key={website}>
            <WebsiteBadge website={website} />
            <SLabelGroup>
              <LabelCards
                website={website}
                handleTap={handleTap}
                allLabels={allLabels}
                webLabels={webLabels}
              />
            </SLabelGroup>
            <SSeperator marginTop="16px" />
          </SItem>
        ))}
    </SContainer>
  );
};

export default WebsiteLabelList;
