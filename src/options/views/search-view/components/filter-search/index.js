import Filters from "./components/filters"
import SearchBar from "./components/search-bar"
import React, { useState } from "react"
import { CompanyLogoSVG } from "../../../../../libs/icons/company-icons"
import { removeLeadingWhiteSpace } from "../../../../../background/analysis/utility/util"
import { filterLabelObject } from "./components/filterLabels"

const FilterSearch = ({
  labels,
  setFilteredLabels,
  websites,
  setFilteredWebsites,
  setShowEmpty,
  location,
}) => {
  const getEmptyCompanyFilter = () => {
    var mapping = {}
    Object.keys(CompanyLogoSVG).map((company) => {
      mapping[company] = false
    })
    return mapping
  }

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

  const [placeholder, setPlaceholder] = useState("")
  const [query, setQuery] = useState("")
  const [companyFilter, setCompanyFilter] = useState(getEmptyCompanyFilter())
  const [permFilter, setPermFilter] = useState(
    location.state && location.state.labeltype
      ? getPermMapping(location.state.labeltype)
      : {
          monetization: true,
          location: true,
          watchlist: true,
          tracking: true,
        }
  )

  /**
   * Filter websites based on user input string from text field
   * @param {string} keyString string the user entered
   */
  const filter = (keyString) => {
    keyString = removeLeadingWhiteSpace(keyString).toLowerCase()

    const filteredKeys = Object.keys(websites).filter((k) =>
      k.includes(keyString)
    )

    var filteredWebsites = {}
    for (const [perm, websiteLevel] of Object.entries(labels)) {
      if (Object.keys(websiteLevel).length > 0 && permFilter[perm]) {
        for (const website of Object.keys(websiteLevel)) {
          if (filteredKeys.includes(website))
            filteredWebsites[website] = websites[website]
        }
      }
    }
    Object.keys(filteredWebsites) == 0
      ? setShowEmpty(true)
      : setShowEmpty(false)
    setFilteredWebsites(filteredWebsites)
  }

  /**
   * Looks for filters and applies them as appropriate.
   *
   * @param {string} keyString
   */
  const filterLabels = () => {
    // filter gets passed as an array in DB call
    var runFilter = false
    var runCompanyFilter = false

    for (const bool of Object.values(permFilter)) {
      if (!bool) {
        runFilter = true
        break
      }
    }

    for (const bool of Object.values(companyFilter)) {
      if (bool) {
        runCompanyFilter = true
        break
      }
    }

    setPlaceholder(getPlaceholder(runCompanyFilter))

    if (runFilter || runCompanyFilter) {
      const filtered = filterLabelObject(
        labels,
        permFilter,
        companyFilter,
        runCompanyFilter
      )
      setFilteredLabels(filtered)
      filter(query, filtered)
    } else {
      setFilteredLabels(labels)
      setFilteredWebsites(websites)
      filter(query, labels)
    }
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
        filterLabels={filterLabels}
        permFilter={permFilter}
        setPermFilter={setPermFilter}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
      />
    </>
  )
}

export default FilterSearch
