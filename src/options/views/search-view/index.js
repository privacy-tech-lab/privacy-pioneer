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
import { permissionEnum, filterKeywordEnum } from "../../../background/analysis/classModels"


/**
 * Search view allowing user to search from identified labels
 */
const SearchView = () => {
  const [allWebsites, setAllWebsites] = useState({})
  const [filteredSites, setFilter] = useState({}) // all websites in DB (passed from previous page)
  const [webLabels, setWebLabels] = useState({}) // all labels in DB (passed from previous page)
  const [indexStack, setIndexStack] = useState([]) //used for permission filtering
  const [filterList, setFilterList] = useState(
    [
      permissionEnum.location,
      permissionEnum.monetization,
      permissionEnum.tracking,
      permissionEnum.watchlist
    ]
  ) // used for permission filtering
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

    // filter the string after the permission filters have been set
    if (indexStack.length > 0) {
      keyString = keyString.slice(indexStack[indexStack.length - 1][0] + 1)
    }

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
  
  const filterLabels = (keyString) => {

    var stackChanged = false
    var filterArr = filterList
    var updatedStack = indexStack

    // clear removed filters
    while ( updatedStack.length > 0 && keyString.length < updatedStack[updatedStack.length - 1][0]) {
      let popIndex, popPerm
      [popIndex, popPerm] = updatedStack.pop()
      filterArr.push(popPerm)
      setFilterList(filterArr)
      stackChanged = true
      getLabels(filterArr).then( labels => {
        setWebLabels(labels)
        filter(keyString, labels)
      })
    }

    // set search query to after the position of the most recent filter
    var keyStringToSearch = keyString
    if (updatedStack.length > 0) { 
      keyStringToSearch = keyString.slice(updatedStack[updatedStack.length - 1][0]) 
    }

    // check for filters
    Object.values(filterKeywordEnum).map(({searchString, permission}) => {
      if (keyStringToSearch.includes(searchString)) {
        const removeIndex = filterArr.indexOf(permission)
        filterArr.splice(removeIndex, 1)
        setFilterList(filterArr)
        updatedStack.push([keyString.length, permission])
        setIndexStack(updatedStack)
      }
    })

    // apply permission filters
    if (updatedStack.length > 0 && keyString.length <= updatedStack[updatedStack.length - 1][0] ) { 
      getLabels(filterArr).then( (labels) => {
        setWebLabels(labels)
        filter(keyString, labels)
      })
    }

    // clear all permission filters
    if (stackChanged && updatedStack.length == 0) {
      getLabels().then( (labels) => {
        setWebLabels(labels)
        setFilter(allWebsites)
        filter(keyString, labels)
      })
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
      getLabels().then((labels) => {setWebLabels(labels)})
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
                  filter(e.target.value);
                  setSearchQuery(e.target.value)
                  }
                }
                defaultValue = {passedSearch}
              />
            </SInputContainer>
            <SFilterButton
              onClick = {() => {
                filterLabels(searchQuery)
                filter(searchQuery)
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
