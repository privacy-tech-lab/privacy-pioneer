/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState, useRef } from "react"
import Scaffold from "../../components/scaffold"
import {
  SBackButton,
  SInput,
  SInputContainer,
  SSearchContainer,
  STitle,
  STop,
  SFilterRow,
  SFilterRowItem,
  SEmpty,
  SFiltersDiv,
  SCompaniesButton
} from "./style"
import { SContainer, SSubtitle } from "./style"
import * as Icons from "../../../libs/icons"
import { Modal } from "bootstrap"
import LabelModal from "../home-view/components/detail-modal"
import WebsiteLabelList from "../../components/website-label-list"
import { getLabels, getWebsites } from "../../../libs/indexed-db/getIdbData.js"
import { useHistory, useLocation } from "react-router"
import { permissionEnum } from "../../../background/analysis/classModels"
import {
  removeLeadingWhiteSpace,
  getAllPerms,
} from "../../../background/analysis/utility/util"
import ReactTooltip from "react-tooltip"
import { seeAllSteps, SeeAllTour } from "../../../libs/tour"
import { getTourStatus } from "../../../libs/settings"
import { CompanyLogoSVG } from "../../../libs/company-icons"
import { filterLabelObject } from "./filterLabels"

const exData = require("../../../libs/tour/exData.json")

/**
 * location.state = undefined | [permission, websites]
 * Depending on if you came to this page from the See All
 * or clicking the large cards
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
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

  const getEmptyCompanyFilter = () => {
    var mapping = {}
    Object.keys( CompanyLogoSVG ).map(company => {
      mapping[company] = false
    })
    return mapping
  }

  const [modal, setModal] = useState({ show: false })
  const history = useHistory()
  const location = useLocation()
  const [allWebsites, setAllWebsites] = useState(
    location.state === undefined ? {} : location.state[1]
  ) // pass websites from previous page if possible
  const [allLabels, setAllLabels] = useState({})
  const [filteredSites, setFilter] = useState({})
  const [webLabels, setWebLabels] = useState({})
  const [permFilter, setPermFilter] = useState(
    location.state === undefined
      ? {
          monetization: true,
          location: true,
          watchlist: true,
          tracking: true,
        }
      : getPermMapping(location.state[0])
  )
  const [showCompanies, setShowCompanies] = useState(false)
  const [companyFilter, setCompanyFilter] = useState(getEmptyCompanyFilter())
  const [placeholder, setPlaceholder] = useState("")
  const [showEmpty, setShowEmpty] = useState(false)
  const [query, setQuery] = useState("")
  const [touring, setTouring] = useState(false)

  /**
   * Looks at the filter to create a placeholder string
   * @returns {string}
   */
  const getPlaceholder = (hasCompanyFilter=false) => {
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
   * Looks for filters and applies them as appropriate.
   *
   * @param {string} keyString
   */
  const filterLabels = (labels = allLabels) => {
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
      const filtered = filterLabelObject(labels, permFilter, companyFilter, runCompanyFilter)
      setWebLabels(filtered)
      filter(query, filtered)
    } 
    else {
      setWebLabels(labels)
      setFilter(allWebsites)
      filter(query, labels)
    }
  }

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  useEffect(() => {
    getTourStatus().then((res) => {
      if (res) {
        setTouring(true)
        setAllWebsites(exData.labelArrayPerSite)
        setFilter(exData.labelArrayPerSite)
        setWebLabels(exData.dataJson)
        setAllLabels(exData.dataJson)
        ReactTooltip.rebuild()
      } else {
        setTouring(false)
        // if we're not passed the getWebsites call from previous:
        if (location.state === undefined) {
          getWebsites().then((websites) => {
            setAllWebsites(websites)
            setFilter(websites)
            getLabels().then((labels) => {
              setWebLabels(labels)
              setAllLabels(labels)
              ReactTooltip.rebuild()
            })
          })
        }
        // if we are then allWebsties is already set. setWebLabels will be called by filterLabels
        else {
          setFilter(allWebsites)
          getLabels().then((labels) => {
            setAllLabels(labels)
            filterLabels(labels)
          })
        }
        setPlaceholder(getPlaceholder())
      }
    })
  }, [])

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
            See browsed websites accessing and sharing your personal information
          </SSubtitle>
          <SFiltersDiv id="filtersTour">
            <SSearchContainer>
              <SInputContainer>
                <Icons.Search size={24} />
                <SInput
                  placeholder={placeholder}
                  onChange={(e) => {
                    filter(e.target.value)
                    setQuery(e.target.value)
                  }}
                />
              </SInputContainer>
            </SSearchContainer>
            <SFilterRow
              show={true}
            >
              {Object.values(permissionEnum).map((permission) => (
                <SFilterRowItem
                  onClick={() => {
                    permFilter[permission] = !permFilter[permission]
                    setPermFilter(permFilter)
                    filterLabels()
                  }}
                  key={permission}
                  highlight={permFilter[permission]}
                >
                  {Icons.getLabelIcon(permission, "21px")}
                  {permission.charAt(0).toUpperCase()
                    .concat(permission.slice(1))}
                </SFilterRowItem>
              ))}
              <SFilterRowItem
                onClick={()=> {
                  setShowCompanies(!showCompanies)
                }}
                key={'Companies'}
                highlight={showCompanies}
              >
                <SCompaniesButton
                  onClick={ () => {
                    Object.keys(companyFilter).map( (company) => {
                        companyFilter[company] = false
                      }
                    );
                    setCompanyFilter(companyFilter);
                    filterLabels()
                  }
                }
                >
                  {'Companies'}
                </SCompaniesButton>
              </SFilterRowItem>
            </SFilterRow>
            <SFilterRow
              show={showCompanies}
            >
              {Object.entries(CompanyLogoSVG).map(([parent, logo]) => (
               <SFilterRowItem
                onClick={() => {
                  companyFilter[parent] = !companyFilter[parent]
                  setCompanyFilter(companyFilter)
                  filterLabels()
                }}
                key={parent}
                highlight={companyFilter[parent]}
               >
                 {logo({size:'21px'})}
               </SFilterRowItem>
              ))}
            </SFilterRow>
          </SFiltersDiv>
          <WebsiteLabelList
            websites={filteredSites}
            allLabels={webLabels}
            handleTap={handleTap}
          />
          <SEmpty show={showEmpty}>
            {" "}
            No search results. Try changing the filter.{" "}
          </SEmpty>
        </SContainer>
      </Scaffold>
      {touring ? <SeeAllTour steps={seeAllSteps} /> : null}
    </React.Fragment>
  )
}

export default SearchView
