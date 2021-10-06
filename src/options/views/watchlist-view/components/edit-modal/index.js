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
import { AddressForm, KeywordForm } from "./components/forms"
import validate from "./components/input-validators"
import ReactTooltip from "react-tooltip"
import {
  getState,
  stateObj,
} from "../../../../../background/analysis/buildUserData/structuredRoutines"

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
  const [_address, setAddress] = useState(
    edit ? keyword[typeEnum.streetAddress] ?? null : ""
  )
  const [_city, setCity] = useState(edit ? keyword[typeEnum.city] ?? null : "")
  const [_state, setStateloc] = useState(
    edit ? keyword[typeEnum.state] ?? null : ""
  )
  const [_zip, setZip] = useState(edit ? keyword[typeEnum.zipCode] ?? null : "")
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
    switch (type) {
      case typeEnum.city:
        setCity(value)
        break
      case typeEnum.state:
        setStateloc(value)
        break
      case typeEnum.zipCode:
        setZip(value)
        break
      case typeEnum.streetAddress:
        setAddress(value)
        break
    }
  }

  const handleKeywordChange = (value) => {
    setKeyword(value)
  }

  useEffect(() => {
    document.addEventListener("mousedown", blur)
    ReactTooltip.rebuild()
    return () => document.removeEventListener("mousedown", blur)
  }, [])

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
          {_keywordType != permissionEnum.location ? (
            <KeywordForm
              keywordType={_keywordType}
              onChange={handleKeywordChange}
              value={_keyword}
            />
          ) : (
            <AddressForm
              onChange={handleAddressChange}
              city={_city}
              state={_state}
              zip={_zip}
              streetAddress={_address}
            />
          )}
          {inputValid ? null : (
            <SErrorText> Please enter a valid {keyType} </SErrorText>
          )}
          <SActionGroup>
            <SAction data-bs-dismiss="modal" aria-label="Close" color="#e57373">
              Cancel
            </SAction>
            <SAction
              onClick={async () => {
                let key
                if (_keywordType == permissionEnum.location) {
                  key = {
                    [typeEnum.streetAddress]: _address,
                    [typeEnum.zipCode]: _zip,
                    [typeEnum.state]: _state,
                    [typeEnum.city]: _city,
                    display: `${_address}, ${_city}, ${_state} ${_zip}`,
                  }
                } else {
                  key = _keyword
                }
                // check if user input is valid
                if (
                  validate({
                    keyword: _keyword,
                    keywordType: _keywordType,
                    setInputValid,
                    setKeyType,
                  })
                ) {
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
