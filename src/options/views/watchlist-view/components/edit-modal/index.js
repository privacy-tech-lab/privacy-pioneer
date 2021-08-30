/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useRef, useState, useEffect } from "react"
import {
  IconWrapper,
  SHeader,
  SLeading,
  SMiddle,
  SModal,
  SNavigationBar,
  STitle,
  STrailing,
  SType,
  SDropdown,
  SActionGroup,
  SAction,
  SDropdownSelection,
  SDropdownOptions,
  SDropdownItem,
  SContent,
  SErrorText,
} from "./style"
import * as Icons from "../../../../../libs/icons"
import { saveKeyword } from "../../../../../libs/indexed-db/updateWatchlist.js"
import {
  keywordTypes,
  permissionEnum,
  typeEnum,
} from "../../../../../background/analysis/classModels"
import { Modal } from "bootstrap"
import Form from "./components/forms"
import inputValidator from "./components/input-validators"
import ReactTooltip from "react-tooltip"
import { getState, stateObj } from "../../../../../background/analysis/buildUserData/structuredRoutines"

/**
 * Popup modal to create/edit keyword
 */
const EditModal = ({ keywordType, keyword, edit, id, updateList }) => {
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)
  const [_keywordType, setKeywordType] = useState(
    edit ? keywordType : "Select Type"
  )
  const [_keyword, setKeyword] = useState(edit ? keyword : "")
  const [_location, setLocation] = useState(edit ? keyword : {})
  const [inputValid, setInputValid] = useState(true)
  const [keyType, setKeyType] = useState("")

  /**
   * Closes dropdown when clicked outside
   */
  const blur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setDropdown(false)
    }
  }

  const handleAddressChange = (type, value) => {
    var newLocation = _location
    newLocation[type] = value
    newLocation["display"] = `${newLocation[typeEnum.streetAddress]}, ${
      newLocation[typeEnum.city]
    }, ${newLocation[typeEnum.state]} ${newLocation[typeEnum.zipCode]} `
    setLocation(newLocation)
  }

  const handleKeywordChange = (value) => {
    setKeyword(value)
  }

  useEffect(() => {
    document.addEventListener("mousedown", blur)
    ReactTooltip.rebuild()
    return () => document.removeEventListener("mousedown", blur)
  }, [])

  /**
   * Reset the form if the input is not valid
   */
  const badInput = (type) => {
    setInputValid(false)
    setKeyType(type)
  }

  /**
   * Validate a user input
   */
  const validate = () => {
    if (
      _keywordType == typeEnum.phoneNumber &&
      !(
        inputValidator.numRegex.test(_keyword) ||
        inputValidator.numRegex2.test(_keyword)
      )
    ) {
      badInput("phone number")
      return false
    } else if (
      _keywordType == typeEnum.emailAddress &&
      !(
        inputValidator.emailRegex.test(_keyword) ||
        inputValidator.emailRegex2.test(_keyword)
      )
    ) {
      badInput("email address")
      return false
    } else if (
      _keywordType == typeEnum.ipAddress &&
      !(
        inputValidator.ipRegex_4.test(_keyword) ||
        inputValidator.ipRegex_6.test(_keyword)
      )
    ) {
      badInput("IP address")
      return false
    } else if (
      _keywordType == typeEnum.userKeyword && 
      !inputValidator.userKeyword.test(_keyword)
    ) {
      badInput('keyword. Length should be 5 or greater.')
      return false
    } else if (_keywordType == permissionEnum.location){
      if (
        (!_location.zipCode == undefined && !inputValidator.zipCode.test(_location.zipCode) )||
        !_location.zipCode == undefined
      ) {
        badInput("zip code")
        return false
      }
      if (
        !(_location.state == undefined || 
        _location.state in stateObj)
      ) {
        badInput("state abbreviation")
        return false
      }
      if (
        _location.zipCode != undefined &&
        _location.state != undefined
      ) {
        if (getState(_location.zipCode)[0] != _location.state) {
          badInput('state / zip combination')
          return false
        }
      }
      if (
        !inputValidator.city_address.test(_location.city)
      ) {
        badInput('city')
        return false
      } 
      if (
        !inputValidator.city_address.test(_location.streetAddress)
      ) {
        badInput('address')
        return false
      }
      if (
        Object.keys(_location).length == 0
      ) {
        return false
      }
      return true 
    } else return true
  }

  return (
    <>
      <SContent className="modal-content">
        <SModal>
          <SNavigationBar>
            <SLeading />
            <SMiddle>
              <STitle>{edit ? "Edit Keyword" : "Add Keyword"}</STitle>
            </SMiddle>
            <STrailing>
              <IconWrapper data-bs-dismiss="modal" aria-label="Close">
                <Icons.Close size="24px" />
              </IconWrapper>
            </STrailing>
          </SNavigationBar>
          <SType>
            <SHeader
              data-place="left"
              // data-tip={"test"}
              data-tip="hello world"
            >
              TYPE
            </SHeader>
            <SDropdown
              ref={dropdownRef}
              onClick={() => {
                setDropdown((state) => !state)
              }}
            >
              <SDropdownOptions show={showDropdown}>
                {Object.keys(keywordTypes).map((key, index) => (
                  <SDropdownItem
                    data-place="right"
                    data-tip={keywordTypes[key]["toolTip"]}
                    onClick={() => {
                      setKeywordType(key)
                      setInputValid(true)
                      setKeyword("")
                    }}
                    key={index}
                  >
                    {keywordTypes[key]["displayName"]}
                  </SDropdownItem>
                ))}
              </SDropdownOptions>
              <SDropdownSelection>
                {_keywordType in keywordTypes
                  ? keywordTypes[_keywordType]["displayName"]
                  : "Select Type"}
                <Icons.ChevronDown size="24px" />
              </SDropdownSelection>
            </SDropdown>
          </SType>
          <Form
            onAddressChange={handleAddressChange}
            onRegularChange={handleKeywordChange}
            keywordType={_keywordType}
            value={
              keywordType == permissionEnum.location ? _location : _keyword
            }
          />
          {inputValid ? null : (
            <SErrorText> Please enter a valid {keyType} </SErrorText>
          )}
          <SActionGroup>
            <SAction data-bs-dismiss="modal" aria-label="Close" color="#e57373">
              Cancel
            </SAction>
            <SAction
              onClick={async () => {
                let key =
                  _keywordType == permissionEnum.location ? _location : _keyword
                // check if user input is valid
                if (validate()) {
                  if (await saveKeyword(key, _keywordType, id)) {
                    await updateList()
                    const modal = Modal.getInstance(
                      document.getElementById("edit-modal")
                    )
                    modal.hide()
                  }
                }
              }}
              color="#64b5f6"
            >
              Save
            </SAction>
          </SActionGroup>
        </SModal>
      </SContent>
    </>
  )
}

export default EditModal
