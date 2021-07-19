import React, { useEffect, useState } from "react";
import WebsiteBadge from "../../../libs/website-badge";
import LabelCard from "../../../libs/label-card";
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style";

/**
 * Makes label cards for a given website
 */

const LabelCards = ({ website, handleTap, labels }) => {
  let webLabel = labels[website];
  return webLabel
    ? Object.entries(webLabel).map(([label, requests]) => (
        <LabelCard
          key={label}
          onTap={() => {
            handleTap({ label, requests, website, show: true });
          }}
          margin="8px 16px 0px 0px"
          label={label}
          requests={requests}
          website={website}
        />
      ))
    : null;
};

/**
 * Displays a list of websites and a quick summary of their privacy labels
 */

const WebsiteLabelList = ({ websites, maxLength, handleTap, labels }) => {
  const entries = Object.entries(websites);
  return (
    <SContainer>
      {entries.slice(0, maxLength ?? entries.length).map(([website, label]) => (
        <SItem key={website}>
          <WebsiteBadge website={website} />
          <SLabelGroup>
            <LabelCards
              website={website}
              handleTap={handleTap}
              labels={labels}
            />
          </SLabelGroup>
          <SSeperator marginTop="16px" />
        </SItem>
      ))}
    </SContainer>
  );
};

export default WebsiteLabelList;
