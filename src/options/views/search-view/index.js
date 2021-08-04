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

  const getAllPerms = () => {
    return [
      permissionEnum.location,
      permissionEnum.monetization,
      permissionEnum.tracking,
      permissionEnum.watchlist
    ]
  }

  const [allWebsites, setAllWebsites] = useState({})
  const [filteredSites, setFilter] = useState({}) // all websites in DB (passed from previous page)
  const [webLabels, setWebLabels] = useState({}) // all labels in DB (passed from previous page)
  const [indexStack, setIndexStack] = useState([]) //used for permission filtering
  const [filterList, setFilterList] = useState(getAllPerms()) // used for permission filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState({ show: false })
  const history = useHistory()
  const location = useLocation()
  const passedSearch = location.state === undefined ? "" : location.state


  const removeLeadingWhiteSpace = (str) => {
    var index = 0
    while (index < str.length && str.charAt(index) == ' ') {
      index += 1
    }
    return str.slice(index)
  } 

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
  
  const filterLabels = (keyString) => {

    var stackChanged = false
    var filterArr = getAllPerms()
    var updatedStack = indexStack

    // empty stack if a previous filter has been removed
    if ( updatedStack.length > 0 && keyString.length < updatedStack[updatedStack.length - 1][0]) {
      stackChanged = true
    }

    updatedStack = []

    // check for filters
    Object.values(filterKeywordEnum).map(({searchString, permission}) => {
      if (keyString.includes(searchString)) {
        const removeIndex = filterArr.indexOf(permission)
        filterArr.splice(removeIndex, 1)
        const index = keyString.indexOf(searchString)
        updatedStack.push([index + searchString.length, permission])
      }
    })

    updatedStack = updatedStack.sort((a,b) => {b[0] - a[0]})

    setIndexStack(updatedStack)
    setFilterList(filterArr)

    // apply permission filters
    if (updatedStack.length > 0 && updatedStack != indexStack ) { 
      getLabels(filterArr).then( (labels) => {
        setWebLabels(labels)
        filter(keyString.slice(updatedStack[updatedStack.length - 1][0]), labels)
      })
    }
    else {
      // clear all permission filters
      if (stackChanged && updatedStack.length == 0) {
        getLabels().then( (labels) => {
          setWebLabels(labels)
          setFilter(allWebsites)
          filter(keyString, labels)
        })
      }
      else {
        if (updatedStack.length > 0){
          filter(keyString.slice(updatedStack[updatedStack.length - 1][0]))
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
              <Icons.Search size = {20}/>
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
