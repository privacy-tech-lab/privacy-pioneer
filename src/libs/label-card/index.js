import React from "react";
import * as Icons from "../icons";
import {
  SCard,
  SDescription,
  SSeperator,
  SHeader,
  SHeaderLeading,
  SHeaderTitle,
  SHeaderTrailing,
  SMore,
  SLogo,
  SBadge,
} from "./style";
import { privacyLabels } from "../../background/analysis/classModels";
import { CompanyLogo } from "../website-logo";
import { getParents } from "../indexed-db";
import { useHistory } from "react-router-dom";

/**
 * Card that briefly summarizes label and description for website
 */
const LabelCard = ({
  requests,
  website,
  label,
  margin,
  onTap,
  popup,
  excludedLabels,
}) => {
  const urls = Object.keys(requests); // detected request urls containing identified data
  const collected = urls.includes(website); // Check if website collected data
  const history = useHistory();

  /**
   * Get label description
   */
  const getDescription = () => {
    if (collected && urls.length > 1) {
      return (
        // `${website} collected and shared ${label} data with ${urls.length - 1}{" "}
        //   companies`
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <SBadge>Collected</SBadge>
          <SBadge>
            Shared with {urls.length - 1}
            {urls.length - 1 > 1 ? " sites" : " site"}
          </SBadge>
        </div>
      );
    } else if (collected) {
      // return `${website} collected ${label} data.`;
      return <SBadge>Collected</SBadge>;
    } else {
      return (
        // `${website} shared ${label} data with ${urls.length} ${
        //   urls.length == 1 ? "company" : "companies"
        // }`;
        <SBadge>
          Shared with {urls.length} {urls.length > 1 ? "sites" : "site"}
        </SBadge>
      );
    }
  };
  const onClick = () => {
    const navigate = ({ urlHash = "" }) => {
      const url = browser.runtime.getURL("options.html");
      browser.tabs.query({ url: url }, function (tabs) {
        if (tabs.length) {
          browser.tabs.update(tabs[0].id, { active: true, url: url + urlHash });
        } else {
          browser.tabs.create({ url: url + urlHash });
        }
      });
    };

    if (excludedLabels.includes(label)) {
      popup ? navigate({ urlHash: "#settings" }) : history.push("/settings");
    } else {
      onTap;
    }
  };

  /**
   * Get third party websites and render badges
   * Render max 2 badges
   */
  const getThirdParties = () => {
    let parentCompanies = getParents(requests);
    return (
      <>
        <SSeperator marginTop="16px" marginBottom="0px" />
        <SLogo>
          {parentCompanies.map((company) => (
            <CompanyLogo
              parent={company}
              key={company}
              margin={"8px 4px 0px 4px"}
            />
          ))}
        </SLogo>
      </>
    );
  };

  return (
    <SCard margin={margin} onClick={onClick} popup={popup}>
      {!excludedLabels.includes(label) ? (
        <div>
          <SHeader>
            <SHeaderLeading>
              {Icons.getLabelIcon(label)}
              <SHeaderTitle>{privacyLabels[label]["displayName"]}</SHeaderTitle>
            </SHeaderLeading>
            <SHeaderTrailing>
              <Icons.ChevronRight size="24px" />
            </SHeaderTrailing>
          </SHeader>
          <SDescription>{getDescription()}</SDescription>
          {getThirdParties()}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            fontSize: "24px",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          Label Locked
          <Icons.Lock size={"48px"} />
        </div>
      )}
    </SCard>
  );
};

export default LabelCard;
