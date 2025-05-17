/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import WebsiteLogo, {
  PrivacyPioneerLogo,
} from "../../../libs/components/website-logo";
import LabelCard from "../../../libs/components/label-card";
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
  SPowerIconWrapper,
} from "./style";
import floating from "../../../assets/logos/Floating.svg";
import NavBar from "../../components/nav-bar";
import { getWebsiteLastVisitedEvidence } from "../../../libs/indexed-db/getIdbData.js";
import { getHostname } from "../../../background/analysis/utility/util.js";
import { useNavigate } from "react-router-dom";
import RiseLoader from "react-spinners/RiseLoader";
import {
  settingsModelsEnum,
} from "../../../background/analysis/classModels";
import {
  getAnalyticsStatus,
  getExtensionStatus,
  toggleExtension,
} from "../../../libs/indexed-db/settings";
import { handleClick } from "../../../libs/indexed-db/getAnalytics";

/**
 * Page view containing current website and identified label cards
 */
const WebsiteView = () => {
  const navigate = useNavigate();
  const [website, setWebsite] = useState("...");
  const [labels, setLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
  const [isOurHomePage, setIsOurHomePage] = useState(false);
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [invalidSite, setInvalidSite] = useState(false);

  /**
   * Navigate to route in options page based on urlHash
   */
  const navigate_customized = ({ urlHash = "" }) => {
    //@ts-ignore
    const url = browser.runtime.getURL("options.html");
    //@ts-ignore
    browser.tabs.query({ url: url }, function (tabs) {
      if (tabs.length) {
        //@ts-ignore
        browser.tabs.update(tabs[0].id, { active: true, url: url + urlHash });
        //@ts-ignore
        browser.tabs.reload();
      } else {
        //@ts-ignore
        browser.tabs.create({ url: url + urlHash });
      }
    });
    // closes the popup on navigation to options home or watchlist
    // removing the timeout breaks the code. may be a hacky solution
    setTimeout(() => window.close(), 10);
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

  /**
   * Checks if current site is the extension's options page
   * @param {String} hostName
   */

  useEffect(() => {
    /**
     * Send message to background page to get url of active tab
     * Then set region of component with website url
     */

    getExtensionStatus().then((res) => {
      setExtensionEnabled(res);
    });

    const message = (request, sender, sendResponse) => {
      if (request.msg === "popup.currentTab") {
        const host = getHostname(request.data);

        //@ts-ignore
        setIsOurHomePage(request.data.includes(browser.runtime.getURL("")));
        setInvalidSite(host == "");

        getWebsiteLastVisitedEvidence(host).then((result) => {
            setLabels(result);
            if (Object.keys(result).length > 0) {
              setTimeout(() => {
                setEmpty(false), setLoading(false);
              }, 800);
            } else setTimeout(() => setLoading(false), 2000);
          });
        setWebsite(host);
      }
    };

    //@ts-ignore
    browser.runtime.onMessage.addListener(message);
    //@ts-ignore
    browser.runtime.sendMessage({ msg: "background.currentTab" });

    return () => {
      //@ts-ignore
      browser.runtime.onMessage.removeListener(message);
    };
  }, []);

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading>
              <SBrandIcon /> <SBrandTitle>Privacy Pioneer</SBrandTitle>
            </SLeading>
          }
          trailing={
            <STrailing>
              <SIconWrapper
                onClick={() => {
                  navigate_customized({ urlHash: "#" }); //Go to Extension Home Page
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      handleClick(
                        "Home Button",
                        "Pop-Up",
                        website.toString(),
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable
                      );
                    }
                  };
                  getAnalysis();
                }}
              >
                <Icons.Home size="32px" />
              </SIconWrapper>
              <SIconWrapper
                onClick={() => {
                  navigate_customized({ urlHash: "#watchlist" }); //Go to Extension Watchlist
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      handleClick(
                        "Watchlist Button",
                        "Pop-Up",
                        website.toString(),
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable
                      );
                    }
                  };
                  getAnalysis();
                }}
              >
                <Icons.Radar size="24px" />
              </SIconWrapper>
              <SPowerIconWrapper
                active={extensionEnabled}
                onClick={async () => {
                  setExtensionEnabled(await toggleExtension());
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      handleClick(
                        "Enable Extension Off: " + extensionEnabled.toString(),
                        "Pop-Up",
                        website.toString(),
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable
                      );
                    }
                  };
                  getAnalysis();
                }}
              >
                <Icons.Power size="24px" />
              </SPowerIconWrapper>
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
            {extensionEnabled && (
              <SHeader>
                {(isOurHomePage || invalidSite) ? (
                  <PrivacyPioneerLogo />
                ) : (
                  <WebsiteLogo
                    large
                    margin={"16px 0px 0px 0px"}
                    website={website}
                  />
                )}
                <STitle>{isOurHomePage ? "Privacy Pioneer" : website}</STitle>
                <SSubtitle>{!(isOurHomePage || invalidSite) && getCount()}</SSubtitle>
              </SHeader>
            )}
            {empty ? (
              <SEmpty>
                <SEmptyText>
                  {extensionEnabled
                    ? isOurHomePage
                      ? "This is our homepage! You won't find anything here. Keep browsing and check back later."
                      : invalidSite ? "Privacy Pioneer is unable to analyze this page." : "Nothing yet...Keep browsing and check back later!"
                    : "The extension is currently disabled! Press the power button to re-enable analysis!"}
                </SEmptyText>
                <img src={floating} />
              </SEmpty>
            ) : (
              Object.entries(labels).map(([label, requests]) => (
                <LabelCard
                  popup
                  key={label}
                  onTap={() => {
                    navigate(`/website/${website}/label/${label}`);
                    const getAnalysis = async () => {
                      const status = await getAnalyticsStatus();
                      if (status == true) {
                        handleClick(
                          "Website View Label Card: " +
                            label.toString() +
                            " Website: " +
                            website.toString(),
                          "Website/Pop-Up",
                          website.toString(),
                          settingsModelsEnum.notApplicable,
                          settingsModelsEnum.notApplicable
                        ); /* label card in website view add string */
                      }
                    };
                    getAnalysis();
                  }}
                  margin="16px 16px 8px 16px"
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
