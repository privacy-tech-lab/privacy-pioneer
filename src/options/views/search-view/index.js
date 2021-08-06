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
  SDropdownItem,
  SEmpty
 } from "./style"
import { SContainer, SSubtitle } from "./style"
import * as Icons from "../../../libs/icons"
import { Modal, Dropdown, Button } from "bootstrap"
import LabelModal from "../home-view/components/detail-modal"
import WebsiteLabelList from "../../components/website-label-list"
import { getLabels, getWebsites } from "../../../libs/indexed-db/getIdbData.js"
import { useHistory, useLocation } from "react-router"
import { filterKeywordEnum } from "../../../background/analysis/classModels"
import { removeLeadingWhiteSpace, getAllPerms } from "../../../background/analysis/utility/util"


/**
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {

  const getPlaceholder = () => {
    const defaultPlaceholder = "Search in: All"
    var updatedPlaceholder = "Search in: "
    var ct = 0
    for (const [perm, val] of Object.entries(permFilter)) {
      if (permFilter[perm]) {
        updatedPlaceholder = updatedPlaceholder.concat(perm).concat(' ')
        ct += 1
      }
    }
    if (ct == 4) {return defaultPlaceholder}
    else {return updatedPlaceholder}
  }

  const getMapping = (typ) => {
    const mapping = 
    {'location': false,
    'monetization': false,
    'watchlist': false,
    'tracking': false} 
    mapping[typ] = true
    return mapping
  }

  const [modal, setModal] = useState({ show: false })
  const history = useHistory()
  const location = useLocation()

  const [allWebsites, setAllWebsites] = useState(
    location.state === undefined ? {} : location.state[1]
  )
  const [allLabels, setAllLabels] = useState({})

  const [filteredSites, setFilter] = useState({}) // all websites in DB (passed from previous page)
  const [webLabels, setWebLabels] = useState({}) // all labels in DB (passed from previous page)

  const [permFilter, setPermFilter] = useState(
    location.state === undefined ? 
    {'location': true,
    'monetization': true,
    'watchlist': true,
    'tracking': true} 
    :
    getMapping(location.state[0])
  )
  const [placeholder, setPlaceholder] = useState(getPlaceholder())
  

  const [showEmpty, setShowEmpty] = useState(false)

  /**
   * Filter websites based on user input string from text field
   * @param {string} keyString string the user entered
   */
  const filter = (keyString, labels = webLabels) => {

    keyString = removeLeadingWhiteSpace(keyString)

    const filteredKeys = Object.keys(allWebsites).filter((k) =>
      k.includes(keyString)
    )

    var filteredWebsites = {}
    for ( const [perm, websiteLevel] of Object.entries(labels)) {
      if (Object.keys(websiteLevel).length > 0) {
        for ( const website of Object.keys(websiteLevel)) {
          if (filteredKeys.includes(website)) filteredWebsites[website] = allWebsites[website]
        }
      }
    }
    
    if (Object.keys(filteredWebsites) == 0) {setShowEmpty(true)}
    else {setShowEmpty(false)}
    setFilter(filteredWebsites)
  }
  
  /**
   * Looks for filters and applies them as appropriate.
   * 
   * @param {string} keyString 
   */
  const filterLabels = () => {

    var filterArr = getAllPerms()

    for (const [perm, val] of Object.entries(permFilter)) {
      if (permFilter[perm]) {
        const removeIndex = filterArr.indexOf(perm)
        filterArr.splice(removeIndex, 1)
      }
    }

    setPlaceholder(getPlaceholder())

    if (filterArr.length > 0) {
      getLabels(filterArr).then( (labels) => {
        setWebLabels(labels)
        filter('', labels)
      })
    }
    else {
      setWebLabels(allLabels)
      setFilter(allWebsites)
      filter('', allLabels)
    }
  }

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  useEffect(() => {
    if (location.state === undefined) {
      getWebsites().then((websites) => {
        setAllWebsites(websites)
        setFilter(websites)
        getLabels().then((labels) => {
          setWebLabels(labels)
          setAllLabels(labels)
        })
      })
    }
    else {
      setFilter(allWebsites)
      filterLabels()
      getLabels().then((labels) => {
        setAllLabels(labels)
      })
    }
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
              <Icons.Search size = {24}/>
              <SInput
                placeholder= {placeholder}
                onChange={(e) => {
                  filter(e.target.value);
                  }
                }
              />
            </SInputContainer>
              {Object.values(filterKeywordEnum).map(({searchString, permission}) => (
                    <SDropdownItem
                      onClick={() => {
                        permFilter[permission] = !permFilter[permission]
                        setPermFilter(permFilter)
                        filterLabels()
                      }}
                      key={permission}
                      show={permFilter[permission]}
                    >
                      {Icons.getLabelIcon(permission, "21px")}
                    </SDropdownItem>
                  )
                )
              }
          </SSearchContainer>
          <WebsiteLabelList
            websites={filteredSites}
            allLabels={webLabels}
            handleTap={handleTap}
          />
          <SEmpty show={showEmpty}> No search results. Try changing the filter. </SEmpty>
        </SContainer>
      </Scaffold>
    </React.Fragment>
  )
}

export default SearchView
