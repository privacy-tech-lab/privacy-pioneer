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
import { AnimatePresence } from "framer-motion"
import { hash, idbKeyval } from "../../../../../libs/indexed-db"
import { keywordTypes } from "../../../../../libs/constants"

const Modal = (props) => {
  const backdropRef = useRef()
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)
  const [keywordType, setKeywordType] = useState(props.edit ? props.keywordType : "Select Type")
  const [keyword, setKeyword] = useState(props.edit ? props.keyword : "")
  const [placeholder, setPlaceholder] = useState("Keyword")

  const dismissModal = (event) => {
    if (backdropRef.current === event.target) props.configModal((config) => ({ ...config, open: false }))
  }

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
            <STitle>{props.edit ? "Edit Keyword" : "Add Keyword"}</STitle>
          </SMiddle>
          <STrailing>
            <IconWrapper onClick={() => props.configModal((config) => ({ ...config, open: false }))}>
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
              {keywordType in keywordTypes ? keywordTypes[keywordType]["displayName"] : "Select Type"}
              <Icons.ChevronDown size="24px" />
            </SDropdownSelection>
          </SDropdown>
        </SType>
        <SKeyword>
          <SHeader>KEYWORD</SHeader>
          <SInput value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={placeholder} />
        </SKeyword>
        <SActionGroup>
          <SAction onClick={() => props.configModal((config) => ({ ...config, open: false }))} color="#e57373">
            Cancel
          </SAction>
          <SAction
            onClick={async () => {
              if (keywordType in keywordTypes && keyword !== "") {
                if (props.edit) await idbKeyval.delete(props.id)
                let key = hash(keyword + keywordType)
                await idbKeyval.set(key, { keyword: keyword, type: keywordType, id: key })
                await props.updateList()
                props.configModal((config) => ({ ...config, open: false }))
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

const EditModal = (props) => {
  return (
    <AnimatePresence>
      {props.showModal ? (
        <Modal
          keywordType={props.keywordType}
          keyword={props.keyword}
          edit={props.edit}
          id={props.id}
          configModal={props.configModal}
          updateList={props.updateList}
        />
      ) : null}
    </AnimatePresence>
  )
}

export default EditModal
