import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import { css } from "@emotion/react";
import WebsiteLogo from "../../../libs/website-logo";
import LabelCard from "../../../libs/label-card";
import * as Icons from "../../../libs/icons";
import {
  SLeading,
  SBrandIcon,
  SBrandTitle,
  STrailing,
  SBody,
  SHeader,
  STitle,
  SSubtitle,
  SIconWrapper,
  SLoader,
  SEmpty,
  SEmptyText,
} from "./style";
import NavBar from "../../components/nav-bar";
import { getWebsiteLabels } from "../../../libs/indexed-db";
import { getHostname } from "../../../background/analysis/searchFunctions";
import { useHistory } from "react-router";
import RiseLoader from "react-spinners/RiseLoader";

/**
 * Page view containing current website and identified label cards
 */
const WebsiteView = () => {
  const history = useHistory();
  const [website, setWebsite] = useState("...");
  const [labels, setLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);

  /**
   * Navigate to route in options page based on urlHash
   */
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

  /**
   * Get number of privacy labels identified
   */
  const getCount = () => {
    const keys = Object.keys(labels);
    if (keys.length === 0) {
      return "0 Privacy Practices Identified";
    } else if (keys.length === 1) {
      return "1 Privacy Practice Identified";
    } else {
      return `${keys.length} Privacy Practices Identified`;
    }
  };

  useEffect(() => {
    /**
     * Send message to background page to get url of active tab
     * Then set state of component with website url
     */
    const message = (request, sender, sendResponse) => {
      if (request.msg === "popup.currentTab") {
        const host = getHostname(request.data);
        getWebsiteLabels(host).then((labels) => {
          setLabels(labels);
          if (Object.keys(labels).length > 0) {
            setTimeout(() => {
              setEmpty(false), setLoading(false);
            }, 800);
          } else setTimeout(() => setLoading(false), 2000);
        });
        setWebsite(host);
      }
    };

    browser.runtime.onMessage.addListener(message);
    console.log("listening");
    browser.runtime.sendMessage({ msg: "background.currentTab" });

    return () => {
      browser.runtime.onMessage.removeListener(message);
      console.log("not listening");
    };
  }, []);

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading>
              <SBrandIcon />{" "}
              <SBrandTitle>Integrated Privacy Analysis</SBrandTitle>
            </SLeading>
          }
          trailing={
            <STrailing>
              <SIconWrapper onClick={() => navigate({ urlHash: "#watchlist" })}>
                <Icons.Radar size="24px" />
              </SIconWrapper>
              <SIconWrapper onClick={() => navigate({ urlHash: "#" })}>
                <Icons.MoreVertical size="24px" />
              </SIconWrapper>
            </STrailing>
          }
        />
      }
      body={
        loading ? (
          <SLoader>
            <RiseLoader loading={loading} color={"#F2E8F9"} size={50} />
          </SLoader>
        ) : (
          <SBody>
            <SHeader>
              <WebsiteLogo
                large
                margin={"16px 0px 0px 0px"}
                website={website}
              />
              <STitle>{website}</STitle>
              <SSubtitle>{getCount()}</SSubtitle>
            </SHeader>
            {empty ? (
              <SEmpty>
                <SEmptyText>
                  We couldn't identify any privacy practices at this time keep
                  browsing and check back later!
                </SEmptyText>
              </SEmpty>
            ) : (
              Object.entries(labels).map(([label, requests]) => (
                <LabelCard
                  key={label}
                  onTap={() =>
                    history.push({
                      pathname: `/website/${website}/label/${label}`,
                    })
                  }
                  margin="16px 16px 0px 16px"
                  label={label}
                  requests={requests}
                  website={website}
                />
              ))
            )}
          </SBody>
        )
      }
    />
  );
};

export default WebsiteView;
