/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useState, useRef, useEffect } from "react";
import {
  SAction,
  SItem,
  SType,
  SDropdownOptions,
  SDropdownItem,
  SButtonText,
  SSection,
} from "./style";
import * as Icons from "../../../../../libs/icons";
import {
  deleteKeyword,
  toggleNotifications,
} from "../../../../../libs/indexed-db/updateWatchlist.js";
import {
  keywordTypes,
  settingsModelsEnum,
} from "../../../../../background/analysis/classModels";
import { Modal } from "bootstrap";
import { getAnalyticsStatus } from "../../../../../libs/indexed-db/settings";
import { handleClick } from "../../../../../libs/indexed-db/getAnalytics";
import ReactTooltip from "react-tooltip";
import {
  IPINFO_IPKEY,
  IPINFO_ADDRESSKEY,
} from "../../../../../background/analysis/buildUserData/importSearchData";

/**
 * List item displaying keyword and type
 * User can edit/delete keyword from vertical options button
 */
const ListItem = ({
  keyword,
  type,
  id,
  configModal,
  updateList,
  location,
  notification,
}) => {
  const dropdownRef = useRef();
  const [showDropdown, setDropdown] = useState(false);
  /**
   * Closes dropdown when clicked outside
   */
  const blur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", blur);
    return () => document.removeEventListener("mousedown", blur);
  }, []);

  return (
    <SItem>
      {id == IPINFO_IPKEY || id == IPINFO_ADDRESSKEY  ?  (
        <SSection >
          <SButtonText data-tip data-for="sButton">
            {keyword}
          </SButtonText>
        </SSection>
      ): <SSection>{keyword}</SSection>}
      <ReactTooltip
        id="sButton"
        tipPointerPosition="start"
        place="right"
        offset="{'left':0}"
        backgroundColor="var(--primaryBrandColor)"
        textColor="var(--primaryBrandTintColor)"
        effect="solid"
        delayShow="350"
      >
        This keyword was automatically generated via ipinfo.io
      </ReactTooltip>
      <div>
        <SType>
          {type in keywordTypes ? keywordTypes[type]["displayName"] : "Error"}
        </SType>
        <div>
          <SAction
            ref={dropdownRef}
            onClick={() => {
              setDropdown((region) => !region);
              const getAnalysis = async () => {
                const status = await getAnalyticsStatus();
                if (status == true) {
                  handleClick(
                    "Watchlist Options",
                    "Watchlist",
                    settingsModelsEnum.notApplicable,
                    settingsModelsEnum.notApplicable,
                    settingsModelsEnum.notApplicable
                  );
                }
              };
              getAnalysis();
            }}
          >
            <SDropdownOptions show={showDropdown}>
              <SDropdownItem
                onClick={async () => {
                  await deleteKeyword(id, type);
                  await updateList();
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      await handleClick(
                        "[Watchlist Deleted] " +
                          type.toString() +
                          ": " +
                          keyword.toString(),
                        "Watchlist",
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable
                      );
                    }
                  };
                  getAnalysis();
                }}
              >
                Delete
              </SDropdownItem>
              <SDropdownItem
                onClick={() => {
                  configModal((config) => ({
                    ...config,
                    edit: true,
                    show: true,
                    keyword: keyword,
                    keywordType: type,
                    id: id,
                    location: location,
                  }));
                  const modal = new Modal(
                    document.getElementById("edit-modal")
                  );
                  modal.show();
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      await handleClick(
                        "Watchlist Edit [" +
                          type.toString() +
                          "] : " +
                          keyword.toString(),
                        "Watchlist",
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable,
                        settingsModelsEnum.notApplicable
                      );
                    }
                  };
                  getAnalysis();
                }}
              >
                Edit
              </SDropdownItem>
            </SDropdownOptions>
            <Icons.MoreVertical size="24px" />
          </SAction>
          <SAction
            onClick={async () => {
              await toggleNotifications(id);
              await updateList();
              const getAnalysis = async () => {
                const status = await getAnalyticsStatus();
                if (status == true) {
                  await handleClick(
                    (notification ? "Unalerted " : "Alerted ") +
                      type.toString() +
                      ": " +
                      keyword.toString(),
                    "Watchlist",
                    settingsModelsEnum.notApplicable,
                    settingsModelsEnum.notApplicable,
                    settingsModelsEnum.notApplicable
                  );
                }
              };
              getAnalysis();
            }}
          >
            {notification ? (
              <Icons.notificationOn size="24px" />
            ) : (
              <Icons.notificationOff size="24px" />
            )}
          </SAction>
        </div>
      </div>
    </SItem>
  );
};

export default ListItem;
