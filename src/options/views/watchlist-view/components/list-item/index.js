/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useState, useRef, useEffect } from "react"
import {
  SAction,
  SItem,
  SKeyword,
  SType,
  SDropdownOptions,
  SDropdownItem,
} from "./style"
import * as Icons from "../../../../../libs/icons"
import {
  deleteKeyword,
  toggleNotifications,
} from "../../../../../libs/indexed-db/updateWatchlist.js"
import { keywordTypes } from "../../../../../background/analysis/classModels"
import { Modal } from "bootstrap"
import { handleClick } from "../../../../../libs/indexed-db/getAnalytics"

/**
 * List item displaying keyword and type
 * User can edit/delete keyword from vertical options button
 */
const ListItem = ({
  keyword,
  type,
  id,
  configModal,
  updateList,
  location,
  notification,
}) => {
  const dropdownRef = useRef()
  const [showDropdown, setDropdown] = useState(false)

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
    <SItem>
      <SKeyword>{keyword}</SKeyword>
      <div>
        <SType>
          {type in keywordTypes ? keywordTypes[type]["displayName"] : "Error"}
        </SType>
        <div>
          <SAction
            ref={dropdownRef}
            onClick={() => setDropdown((region) => !region)}
          >
            <SDropdownOptions show={showDropdown}>
              <SDropdownItem
                onClick={async () => {
                  await deleteKeyword(id, type)
                  await updateList()
                  await handleClick('[Watchlist Deleted] ' + type.toString() + ': ' + keyword.toString())
                }}
              >
                Delete
              </SDropdownItem>
              <SDropdownItem
                onClick={() => {
                  configModal((config) => ({
                    ...config,
                    edit: true,
                    show: true,
                    keyword: keyword,
                    keywordType: type,
                    id: id,
                    location: location,
                  }))
                  const modal = new Modal(document.getElementById("edit-modal"))
                  modal.show()
                }}
              >
                Edit
              </SDropdownItem>
            </SDropdownOptions>
            <Icons.MoreVertical size="24px" />
          </SAction>
          <SAction
            onClick={async () => {
              await toggleNotifications(id)
              await updateList()
              await handleClick('Alerted: ' + keyword.toString()) /*Cannot differ when unalerted need to fix*/
            }}
          >
            {notification ? (
              <Icons.notificationOn size="24px" />
            ) : (
              <Icons.notificationOff size="24px" />
            )}
          </SAction>
        </div>
      </div>
    </SItem>
  )
}

export default ListItem
