import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import { SBackButton, SInput, SInputContainer, STitle, STop } from "./style";
import { SContainer, SSubtitle } from "./style";
import * as Icons from "../../../libs/icons";
import WebsiteLabelList from "../../components/website-label-list";
import { getWebsites } from "../../../libs/indexed-db";
import { useHistory } from "react-router";

/**
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
  const [allWebsites, setAllWebsites] = useState({});
  const [filteredSites, setFilter] = useState({});
  const history = useHistory();

  /**
   * Filter websites based on user input string from text field
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

  useEffect(() => {
    getWebsites().then((websites) => {
      setAllWebsites(websites);
      setFilter(websites);
    });
  }, []);

  return (
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
        <WebsiteLabelList websites={filteredSites} />
      </SContainer>
    </Scaffold>
  );
};

export default SearchView;
