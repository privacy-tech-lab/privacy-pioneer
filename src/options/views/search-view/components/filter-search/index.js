/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { Filters } from "./components/filters";
import { SearchBar } from "./components/search-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  getPermMapping,
  filter,
  filterLabels,
  getPlaceholder,
  getEmptyCompanyFilter,
} from "./components/utils/filter-util";

/**
 * Combination of filter section and search section
 * Both components need common functions and regions
 * Broken up in order to increase readability
 * @param {object} obj
 * @param {object} obj.labels
 * @param {object} obj.websites
 * @param {function(object):void} obj.setFilteredLabels
 * @param {function(object):void} obj.setFilteredWebsites
 * @param {function(boolean):void} obj.setShowEmpty
 * @param {object} obj.location
 * 
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

      Object.keys(filteredWebsites).length == 0
        ? setShowEmpty(true)
        : setShowEmpty(false);
      setFilteredWebsites(filteredWebsites);
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
    onChange(query);

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
        // CHECK
        getEmptyCompanyFilter={getEmptyCompanyFilter}
      />
    </>
  );
};

export default FilterSearch;
