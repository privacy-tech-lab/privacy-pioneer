import React, { useRef, useState, useEffect } from "react"
import {
  IconWrapper,
  SBackdrop,
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
} from "./style"
import * as Icons from "../../../../../libs/icons"
import { saveKeyword } from "../../../../../libs/indexed-db"
import { keywordTypes } from "../../../../../background/analysis/classModels"

/**
 * Popup modal to create/edit keyword
 */
const EditModal = ({ keywordType, keyword, edit, id, configModal, updateList }) => {
  const backdropRef = useRef()
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)
  const [_keywordType, setKeywordType] = useState(edit ? keywordType : "Select Type")
  const [_keyword, setKeyword] = useState(edit ? keyword : "")
  const [placeholder, setPlaceholder] = useState("Keyword")

  /**
   * Closes modal and refocuses watchlist view
   */
  const dismissModal = (event) => {
    if (backdropRef.current === event.target) configModal((config) => ({ ...config, open: false }))
  }

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
  })

  return (
    <SBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
      ref={backdropRef}
      onClick={dismissModal}
    >
      <SModal>
        <SNavigationBar>
          <SLeading />
          <SMiddle>
            <STitle>{edit ? "Edit Keyword" : "Add Keyword"}</STitle>
          </SMiddle>
          <STrailing>
            <IconWrapper onClick={() => configModal((config) => ({ ...config, open: false }))}>
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
          <SAction onClick={() => configModal((config) => ({ ...config, open: false }))} color="#e57373">
            Cancel
          </SAction>
          <SAction
            onClick={async () => {
              if (await saveKeyword(_keyword, _keywordType, id)) {
                await updateList()
                configModal((config) => ({ ...config, open: false }))
              }
            }}
            color="#64b5f6"
          >
            Save
          </SAction>
        </SActionGroup>
      </SModal>
    </SBackdrop>
  )
}

export default EditModal
