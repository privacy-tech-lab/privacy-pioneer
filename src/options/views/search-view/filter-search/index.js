import Filters from "./components/filters"
import SearchBar from "./components/search-bar"
import React, { useState } from "react"
import { removeLeadingWhiteSpace } from "../../../../background/analysis/utility/util"

const FilterSearch = ({
  allLabels,
  webLabels,
  setWebLabels,
  allWebsites,
  setFilter,
  setShowEmpty,
}) => {
  /**
   * Takes in a type passed from the previous page and returns
   * the appropriate filter mapping
   * @param {string} typ
   * @returns {Dict}
   */

  const getPermMapping = (typ) => {
    const mapping = {
      monetization: false,
      location: false,
      watchlist: false,
      tracking: false,
    }
    mapping[typ] = true
    return mapping
  }

  /**
   * Filter websites based on user input string from text field
   * @param {string} keyString string the user entered
   */
  const filter = (keyString, labels = webLabels) => {
    keyString = removeLeadingWhiteSpace(keyString).toLowerCase()

    const filteredKeys = Object.keys(allWebsites).filter((k) =>
      k.includes(keyString)
    )

    var filteredWebsites = {}
    for (const [perm, websiteLevel] of Object.entries(labels)) {
      if (Object.keys(websiteLevel).length > 0 && permFilter[perm]) {
        for (const website of Object.keys(websiteLevel)) {
          if (filteredKeys.includes(website))
            filteredWebsites[website] = allWebsites[website]
        }
      }
    }

    Object.keys(filteredWebsites) == 0
      ? setShowEmpty(true)
      : setShowEmpty(false)
    setFilter(filteredWebsites)
  }

  /**
   * Looks at the filter to create a placeholder string
   * @returns {string}
   */

  const getPlaceholder = (hasCompanyFilter = false) => {
    const defaultPlaceholder = "in: All "
    var updatedPlaceholder = "in: "
    var ct = 0
    for (const [perm, bool] of Object.entries(permFilter)) {
      if (bool) {
        ct += 1
        updatedPlaceholder = updatedPlaceholder.concat(perm).concat(" ")
      }
    }

    if (ct == 4) {
      updatedPlaceholder = defaultPlaceholder
    }
    if (ct == 0) {
      return "in: None "
    }
    if (hasCompanyFilter) {
      updatedPlaceholder = updatedPlaceholder.concat("companies: ")
      for (const [company, setting] of Object.entries(companyFilter)) {
        if (setting) {
          updatedPlaceholder = updatedPlaceholder.concat(`${company} `)
        }
      }
    }
    return updatedPlaceholder
  }

  const [placeholder, setPlaceholder] = useState("")
  const [query, setQuery] = useState("")
  const [permFilter, setPermFilter] = useState(
    location.state
      ? getPermMapping(location.state.labeltype)
      : {
          monetization: true,
          location: true,
          watchlist: true,
          tracking: true,
        }
  )

  return (
    <>
      <SearchBar
        setQuery={setQuery}
        placeholder={placeholder}
        setPlaceholder={setPlaceholder}
        getPlaceholder={getPlaceholder}
        filter={filter}
      />
      <Filters
        getPlaceholder={getPlaceholder}
        setPlaceholder={setPlaceholder}
        filter={filter}
        permFilter={permFilter}
        setPermFilter={setPermFilter}
        query={query}
        webLabels={webLabels}
        setWebLabels={setWebLabels}
        allWebsites={allWebsites}
        allLabels={allLabels}
        setFilter={setFilter}
      />
    </>
  )
}

export default FilterSearch
