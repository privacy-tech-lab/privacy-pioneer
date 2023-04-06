/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import {
  SAddButton,
  SEmpty,
  SHeader,
  SListContent,
  SListHeader,
  STitle,
} from "./style";
import { SContainer, SSubtitle } from "./style";
import * as Icons from "../../../libs/icons";
import ListItem from "./components/list-item";
import EditModal from "./components/edit-modal";
import { watchlistKeyval } from "../../../libs/indexed-db/openDB.js";
import { Modal } from "bootstrap";
import {
  permissionEnum,
  settingsModelsEnum,
  typeEnum,
} from "../../../background/analysis/classModels";
import ReactTooltip from "react-tooltip";
import { saveKeyword } from "../../../libs/indexed-db/updateWatchlist.js";
import { apiIPToken } from "../../../libs/holdAPI";
import { getAnalyticsStatus } from "../../../libs/indexed-db/settings";
import { handleClick } from "../../../libs/indexed-db/getAnalytics";

/**
 * Watchlist page view allowing user to add/modify keywords
 */
const WatchlistView = () => {
  const [modalConfig, configModal] = useState({ show: false, edit: false });
  const [items, setItems] = useState([]);

  /**
   * Inflates view with keywords from watchlist keystore. Sends message to background script to update data.
   */
  const updateList = () => {
    watchlistKeyval.values().then((values) => setItems(values));
    browser.runtime.sendMessage({
      msg: "dataUpdated",
    });
  };

  /**
   * Async function to fetch the user's IP and add it to their watchlist
   *
   * @returns Nothing. Updates the watchlist with the fetched IP Address.
   */
  const getIP = async () => {
    await fetch("http://ipinfo.io/json?token" + apiIPToken)
      .then((data) => data.json())
      .then(async function (data) {
        const myIP = data.ip;
        if (await saveKeyword(myIP, typeEnum.ipAddress, null)) {
          await updateList();
        }
      });
  };

  useEffect(() => {
    ReactTooltip.hide();
    updateList();
    // Add listener to modal so we can reset it by taking it off the dom so it doesn't hold references
    document
      .getElementById("edit-modal")
      .addEventListener("hidden.bs.modal", () => {
        configModal({ show: false });
      });
  }, []);

  return (
    <React.Fragment>
      <div
        className="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="edit-modal"
        tabIndex="-1"
        aria-labelledby="edit-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          {modalConfig.show ? (
            <EditModal
              passKeywordType={modalConfig.keywordType}
              passKeyword={
                modalConfig.keywordType != permissionEnum.location
                  ? modalConfig.keyword
                  : modalConfig.location
              }
              id={modalConfig.id}
              edit={modalConfig.edit}
              configModal={configModal}
              updateList={updateList}
            />
          ) : null}
        </div>
      </div>

      <Scaffold>
        <SContainer>
          <SHeader>
            <div>
              <STitle>Watchlist</STitle>
              <SSubtitle>
                Edit your watchlist so you can keep track of how companies
                collect and share your personal information
              </SSubtitle>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "end",
              }}
            >
              <SAddButton
                onClick={() => {
                  configModal({ show: true });
                  const modal = new Modal(
                    document.getElementById("edit-modal")
                  );
                  modal.show();
                  const getAnalysis = async () => {
                    const status = await getAnalyticsStatus();
                    if (status == true) {
                      handleClick(
                        "Add Keyword",
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
                <Icons.Plus size="24px" />
                Add Keyword
              </SAddButton>
            </div>
          </SHeader>
          <SListHeader> 
            <div style={{flex:2}}>KEYWORD</div> 
            <div style={{flex:1}}>TYPE</div> 
            <div style={{flex:1}}>CATEGORY</div>
          </SListHeader>
          <SListContent>
            {items.length != 0 ? (
              items.map((item) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  keyword={
                    item.type != permissionEnum.location
                      ? item.keyword
                      : item.location.display
                  }
                  location={item.location}
                  configModal={configModal}
                  updateList={updateList}
                  notification={item.notification}
                />
              ))
            ) : (
              <SEmpty>
                You currently have no keywords or IP. Press "Add Keyword" or
                "Add IP"!
              </SEmpty>
            )}
          </SListContent>
        </SContainer>
      </Scaffold>
    </React.Fragment>
  );
};

export default WatchlistView;
