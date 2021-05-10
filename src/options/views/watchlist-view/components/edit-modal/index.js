import React, { useRef, useState, useEffect } from "react"
import {
  IconWrapper,
  SHeader,
  SInput,
  SKeyword,
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
} from "./style"
import * as Icons from "../../../../../libs/icons"
import { saveKeyword } from "../../../../../libs/indexed-db"
import { keywordTypes } from "../../../../../background/analysis/classModels"
import { Modal } from "bootstrap"

/**
 * Popup modal to create/edit keyword
 */
const EditModal = ({ keywordType, keyword, edit, id, updateList }) => {
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)
  const [_keywordType, setKeywordType] = useState(edit ? keywordType : "Select Type")
  const [_keyword, setKeyword] = useState(edit ? keyword : "")
  const [placeholder, setPlaceholder] = useState("Keyword")

  /**
   * Closes dropdown when clicked outside
   */
  const blur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", blur)
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
            <SHeader>TYPE</SHeader>
            <SDropdown ref={dropdownRef} onClick={() => setDropdown((state) => !state)}>
              <SDropdownOptions show={showDropdown}>
                {Object.keys(keywordTypes).map((key, index) => (
                  <SDropdownItem
                    onClick={() => {
                      setKeywordType(key)
                      setPlaceholder(keywordTypes[key]["placeholder"])
                    }}
                    key={index}
                  >
                    {keywordTypes[key]["displayName"]}
                  </SDropdownItem>
                ))}
              </SDropdownOptions>
              <SDropdownSelection>
                {_keywordType in keywordTypes ? keywordTypes[_keywordType]["displayName"] : "Select Type"}
                <Icons.ChevronDown size="24px" />
              </SDropdownSelection>
            </SDropdown>
          </SType>
          <SKeyword>
            <SHeader>KEYWORD</SHeader>
            <SInput value={_keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={placeholder} />
          </SKeyword>
          <SActionGroup>
            <SAction data-bs-dismiss="modal" aria-label="Close" color="#e57373">
              Cancel
            </SAction>
            <SAction
              onClick={async () => {
                if (await saveKeyword(_keyword, _keywordType, id)) {
                  await updateList()
                  const modal = Modal.getInstance(document.getElementById("edit-modal"))
                  modal.hide()
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
