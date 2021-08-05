/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import { SBackButton, SFilterButton, SInput, SInputContainer, SSearchContainer, STitle, STop } from "./style"
import { SContainer, SSubtitle } from "./style"
import * as Icons from "../../../libs/icons"
import { Modal } from "bootstrap"
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

  const [allWebsites, setAllWebsites] = useState({})
  const [allLabels, setAllLabels] = useState({})
  const [filteredSites, setFilter] = useState({}) // all websites in DB (passed from previous page)
  const [webLabels, setWebLabels] = useState({}) // all labels in DB (passed from previous page)
  const [indexStack, setIndexStack] = useState([]) //used for permission filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState({ show: false })
  const history = useHistory()
  const location = useLocation()
  const passedSearch = location.state === undefined ? "" : location.state

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

    setFilter(filteredWebsites)
  }
  
  /**
   * Core filtering function. 
   * Looks for filters and applies them as appropriate.
   * Makes appropriate calls to the above filter function.
   * @param {string} keyString 
   */
  const filterLabels = (keyString) => {

    var resetLabels = false
    var filterArr = getAllPerms()

    // reset labels if all previous filters have been removed
    if ( indexStack.length > 0 && keyString.length < indexStack[0]) {
      resetLabels = true
    }

    var updatedStack = []

    // check for filters
    Object.values(filterKeywordEnum).map(({searchString, permission}) => {
      if (keyString.includes(searchString)) {
        const removeIndex = filterArr.indexOf(permission)
        filterArr.splice(removeIndex, 1)
        const index = keyString.indexOf(searchString)
        updatedStack.push(index + searchString.length)
      }
    })

    // sort and set stack
    var sortedStack = updatedStack.sort()
    setIndexStack(sortedStack)

    // apply permission filters if stack changed and there are filters
    if (sortedStack.length > 0 && sortedStack != indexStack ) { 
      getLabels(filterArr).then( (labels) => {
        setWebLabels(labels)
        filter(keyString.slice(sortedStack[sortedStack.length - 1]), labels)
      })
    }
    else {
      // clear all filters if they've all been removed
      if (resetLabels && sortedStack.length == 0) {
          setWebLabels(allLabels)
          setFilter(allWebsites)
          filter(keyString, allLabels)
      }
      else {
        // otherwise, just filter by website
        if (sortedStack.length > 0) {
          filter(keyString.slice(sortedStack[sortedStack.length - 1]))
        }
        else {
          filter(keyString)
        }
        
      }
    }   
  }

  const handleTap = (items) => {
    const modal = new Modal(document.getElementById("detail-modal"))
    setModal(items)
    modal.show()
  }

  useEffect(() => {
    getWebsites().then((websites) => {
      setAllWebsites(websites)
      setFilter(websites)
      getLabels().then((labels) => {
        setWebLabels(labels)
        setAllLabels(labels)
      })
    })
    setSearchQuery(passedSearch)
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
                placeholder="Search"
                onChange={(e) => {
                  filterLabels(e.target.value);
                  setSearchQuery(e.target.value)
                  }
                }
                defaultValue = {passedSearch}
              />
            </SInputContainer>
            <SFilterButton
              onClick = {() => {
                filterLabels(searchQuery)
              }}
              > <Icons.Filter size={24} /> 
            </SFilterButton>
          </SSearchContainer>
          <WebsiteLabelList
            websites={filteredSites}
            allLabels={webLabels}
            handleTap={handleTap}
          />
        </SContainer>
      </Scaffold>
    </React.Fragment>
  )
}

export default SearchView
