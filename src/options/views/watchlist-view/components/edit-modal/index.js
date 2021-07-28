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
      _keywordType == typeEnum.phone &&
      !(
        inputValidator.numRegex.test(_keyword) ||
        inputValidator.numRegex2.test(_keyword)
      )
    ) {
      badInput("phone number")
      return false
    } else if (
      _keywordType == typeEnum.email &&
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
    } else return true
  }

  return (
    <>
      <ReactTooltip
        id="editModal"
        effect="solid"
        place="right"
        backgroundColor="var(--primaryBrandTintColor)"
        textColor="var(--primaryBrandColor)"
        delayShow="500"
        multiline
      />
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
            <SHeader>TYPE</SHeader>
            <SDropdown
              ref={dropdownRef}
              onClick={() => {
                setDropdown((state) => !state)
              }}
            >
              <SDropdownOptions show={showDropdown}>
                {Object.keys(keywordTypes).map((key, index) => (
                  <SDropdownItem
                    data-tip={keywordTypes[key]["toolTip"]}
                    data-for="editModal"
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
