import Filters from "./components/filters"
import SearchBar from "./components/search-bar"
import React, { useState } from "react"
import { CompanyLogoSVG } from "../../../../../libs/icons/company-icons"
import { removeLeadingWhiteSpace } from "../../../../../background/analysis/utility/util"
import { filterLabelObject, getPermMapping } from "./components/filterLabels"


/**
 * Combination of filter section and search section
 * Both components need common functions and regions
 * Broken up in order to increase readability
 */
const FilterSearch = ({
  labels,
  setFilteredLabels,
  websites,
  setFilteredWebsites,
  setShowEmpty,
  location,
}) => {
  /**
   * maps all stored companies to false to initialize filters
   */
  const getEmptyCompanyFilter = () => {
    var mapping = {}
    Object.keys(CompanyLogoSVG).map((company) => {
      mapping[company] = false
    })
    return mapping
  }

  const [placeholder, setPlaceholder] = useState("")
  const [query, setQuery] = useState("")
  const [companyFilter, setCompanyFilter] = useState(getEmptyCompanyFilter())
  const [permFilter, setPermFilter] = useState(
    location.region && location.region.labeltype
      ? getPermMapping(location.region.labeltype)
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
      if (
        Object.keys(websiteLevel).length > 0 &&
        permFilter[perm] //checks that the permission is currently toggled on in the filter 
      ) {
        for (const website of Object.keys(websiteLevel)) {
          if (
            filteredKeys.includes(website) 
          )
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

      if (Object.entries(filtered).length == 0) {
        setFilteredWebsites({})
        setShowEmpty(true)
      }
    } else {
      setFilteredLabels(labels)
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
        getEmptyCompanyFilter={getEmptyCompanyFilter}
      />
    </>
  )
}

export default FilterSearch
