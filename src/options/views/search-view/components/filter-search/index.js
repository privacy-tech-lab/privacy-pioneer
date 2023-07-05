/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import Filters from "./components/filters";
import SearchBar from "./components/search-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  getPermMapping,
  filter,
  filterLabels,
  getPlaceholder,
  getEmptyCompanyFilter,
} from "./components/utils/filter-util";

/**
 * This is a global variable
 */
let globalUrls = null
let globalUnmatched = null

/**
 * Combination of filter section and search section
 * Both components need common functions and regions
 * Broken up in order to increase readability
 */
const FilterSearch = ({
  labels,
  websites,
  setFilteredLabels,
  setFilteredWebsites,
  setShowEmpty,
  location,
}) => {
  const [placeholder, setPlaceholder] = useState("");
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState(getEmptyCompanyFilter());
  const [permFilter, setPermFilter] = useState(
    location.region && location.region.labeltype
      ? getPermMapping(location.region.labeltype)
      : {
          monetization: true,
          location: true,
          watchlist: true,
          tracking: true,
        }
  );

  useEffect(() => {
    setPlaceholder(getPlaceholder(false, companyFilter, permFilter));
  }, []);

  const onChange = useCallback(
    (inputString, permFilterLabels = permFilter) => {
      const filteredWebsites = filter(inputString, websites, permFilterLabels);
      setQuery(inputString);

      Object.keys(filteredWebsites) == 0
        ? setShowEmpty(true)
        : setShowEmpty(false);
      setFilteredWebsites(filteredWebsites);
      console.dir(filteredWebsites);
      globalUrls = filteredWebsites
    },
    [permFilter, websites]
  );

  const onLabelClicked = useCallback(() => {
    const filteredLabels = filterLabels(
      permFilter,
      companyFilter,
      labels,
      setPlaceholder
    );
    setFilteredLabels(filteredLabels);
    console.dir(filteredLabels)
    console.dir(globalUrls)

    /**
     * Function to find sites with empty label 
     * when filters are applied
     */

    const unmatchedUrls = [];

  
    for (const url in globalUrls) {
      let foundMatch = false;
      
      //Filter through filter categories (monetization, location,... etc)
      for (const category in filteredLabels) {
        if (filteredLabels[category][url]) {
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        unmatchedUrls.push(url) ;
      }
    }

    console.log("Unmatched Urls:", unmatchedUrls)
    globalUnmatched = unmatchedUrls

    onChange(query);
    console.log(globalUnmatched)
    
    if (Object.entries(filteredLabels).length == 0) {
      setFilteredWebsites({});
      setShowEmpty(true);
    } 
  }, [
    labels,
    permFilter,
    companyFilter,
    query,
    setFilteredWebsites,
    setShowEmpty,
  ]);

  return (
    <>
      <SearchBar onChange={onChange} placeholder={placeholder} />
      <Filters
        filterLabels={onLabelClicked}
        permFilter={permFilter}
        setPermFilter={setPermFilter}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        getEmptyCompanyFilter={getEmptyCompanyFilter}
      />
    </>
  );
};

export default FilterSearch;
