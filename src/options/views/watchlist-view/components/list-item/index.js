import React, { useState, useRef, useEffect } from "react"
import { SAction, SItem, SKeyword, SType, SDropdownOptions, SDropdownItem } from "./style"
import * as Icons from "../../../../../libs/icons"
import { WatchlistKeyval } from "../../../../../libs/indexed-db"
import { keywordTypes } from "../../../../../background/analysis/classModels"

const ListItem = (props) => {
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)
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
    <SItem>
      <SKeyword>{props.keyword}</SKeyword>
      <div>
        <SType>{props.type in keywordTypes ? keywordTypes[props.type]['displayName'] : 'Error'}</SType>
        <SAction ref={dropdownRef} onClick={() => setDropdown((state) => !state)}>
          <SDropdownOptions show={showDropdown}>
            <SDropdownItem
              onClick={async () => {
                await WatchlistKeyval.delete(props.id)
                await props.updateList()
              }}
            >
              Delete
            </SDropdownItem>
            <SDropdownItem
              onClick={() => {
                props.configModal((config) => ({
                  ...config,
                  open: true,
                  edit: true,
                  keyword: props.keyword,
                  keywordType: props.type,
                  id: props.id,
                }))
              }}
            >
              Edit
            </SDropdownItem>
          </SDropdownOptions>
          <Icons.MoreVertical size="24px" />
        </SAction>
      </div>
    </SItem>
  )
}

export default ListItem
