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
  const [placeholder, setPlaceholder] = useState("")
  const [showEmpty, setShowEmpty] = useState(false)
  const [query, setQuery] = useState("")

  /**
   * Looks at the filter to create a placeholder string
   * @returns {string}
   */
  const getPlaceholder = () => {
    const defaultPlaceholder = "Search in: All"
    var updatedPlaceholder = "Search in: "
    var ct = 0
    for (const [perm, bool] of Object.entries(permFilter)) {
      if (bool) {
        ct += 1
        updatedPlaceholder = updatedPlaceholder.concat(perm).concat(" ")
      }
    }

    if (ct == 4) {
      return defaultPlaceholder
    }
    if (ct == 0) {
      return "Search in: None"
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
      if (Object.keys(websiteLevel).length > 0) {
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
  const filterLabels = () => {
    // filter gets passed as an array in DB call
    var filterArr = getAllPerms()

    // update array based on filter settings
    for (const [perm, bool] of Object.entries(permFilter)) {
      if (bool) {
        const removeIndex = filterArr.indexOf(perm)
        filterArr.splice(removeIndex, 1)
      }
    }

    setPlaceholder(getPlaceholder())

    if (filterArr.length > 0) {
      getLabels(filterArr).then((labels) => {
        setWebLabels(labels)
        filter(query, labels)
      })
    } else {
      setWebLabels(allLabels)
      setFilter(allWebsites)
      filter(query, allLabels)
    }
  }

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  useEffect(() => {
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
      filterLabels()
      getLabels().then((labels) => {
        setAllLabels(labels)
      })
    }
    setPlaceholder(getPlaceholder())
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
            See browsed webistes accessing and sharing your personal information
          </SSubtitle>
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
          <SFilterRow>
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
                {" "
                  .concat(permission.charAt(0).toUpperCase())
                  .concat(permission.slice(1))}
              </SFilterRowItem>
            ))}
          </SFilterRow>
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
    </React.Fragment>
  )
}

export default SearchView
