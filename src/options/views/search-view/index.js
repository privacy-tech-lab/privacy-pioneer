import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import { SBackButton, SInput, SInputContainer, STitle, STop } from "./style";
import { SContainer, SSubtitle } from "./style";
import * as Icons from "../../../libs/icons";
import { Modal } from "bootstrap";
import LabelModal from "../home-view/components/detail-modal";
import WebsiteLabelList from "../../components/website-label-list";
import { getLabels, getWebsites } from "../../../libs/indexed-db/getIdbData.js";
import { useHistory, useLocation } from "react-router";

/**
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
  const location = useLocation();
  const [allWebsites, setAllWebsites] = useState({});
  const [filteredSites, setFilter] = useState(
    typeof location.state != "undefined" ? location.state[0] : {}
  ); // all websites in DB (passed from previous page)
  const [webLabels, setWebLabels] = useState(
    typeof location.state != "undefined" ? location.state[1] : {}
  ); // all labels in DB (passed from previous page)
  const [modal, setModal] = useState({ show: false });
  const history = useHistory();

  /**
   * Filter websites based on user input string from text field
   * @param {string} keyString string the user entered
   */
  const filter = (keyString) => {
    const filteredKeys = Object.keys(allWebsites).filter((k) =>
      k.includes(keyString)
    );
    var filteredWebsites = {};
    filteredKeys.forEach(
      (websiteName) =>
        (filteredWebsites[websiteName] = allWebsites[websiteName])
    );
    setFilter(filteredWebsites);
  };

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"));
    setModal(items);
    modal.show();
  };

  useEffect(() => {
    getWebsites().then((websites) => {
      setAllWebsites(websites);

      // we only call the setFilter and setWebLabels hooks if we weren't passed the data
      // from the previous page
      if (typeof location.state == "undefined") {
        setFilter(websites);
      }
      if (typeof location.state == "undefined") {
        getLabels().then((res) => {
          setWebLabels(res.byWebsite);
        });
      }
    });
  }, []);

  return (
    <React.Fragment>
      <LabelModal
        label={modal.label}
        requests={modal.requests}
        website={modal.website}
        show={modal.show}
      />
      <Scaffold>
        <SContainer>
          <STop>
            <SBackButton
              onClick={() => history.goBack()}
              whileHover={{ scale: 1.2 }}
            >
              <Icons.Arrow size={18} />
            </SBackButton>
            <STitle>History</STitle>
          </STop>
          <SSubtitle>
            See browsed webistes accessing and sharing your personal information
          </SSubtitle>
          <SInputContainer>
            <Icons.Search size="24px" />
            <SInput
              placeholder="Search"
              onChange={(e) => filter(e.target.value)}
            />
          </SInputContainer>
          <WebsiteLabelList
            websites={filteredSites}
            allLabels={webLabels}
            handleTap={handleTap}
          />
        </SContainer>
      </Scaffold>
    </React.Fragment>
  );
};

export default SearchView;
