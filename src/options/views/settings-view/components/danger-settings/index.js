/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import {
  deleteEvidenceDB,
  deleteKeywordDB,
} from "../../../../../libs/indexed-db/settings"
import {
  SSubtitle,
  SSettingHeader,
  SDangerSection,
  SDangerButton,
} from "./style"

/**
 * Danger section of Settings involving deletion from the database
 */
export const DangerZone = () => {
  /**
   * Deletes all stored evidence from DB on press
   */
  const handleEvidence = () => {
    if (
      confirm(
        "Are you sure you want to delete all of the evidence we've collected?"
      )
    ) {
      deleteEvidenceDB()
    }
  }
  /**
   * Deletes Keywords from watchlist from DB on press
   */
  const handleWatchlist = () => {
    if (
      confirm(
        "Are you sure you want to delete all of the keywords you've asked us to track?"
      )
    ) {
      deleteKeywordDB()
    }
  }
  return (
    <SDangerSection>
      <SSettingHeader>Danger Zone</SSettingHeader>
      <SSubtitle>Permenantly clear your stored data</SSubtitle>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "12px" }}>
        <SDangerButton
          data-tip="Delete all of the data that we have collected from your local storage"
          onClick={handleEvidence}
        >
          Delete Data
        </SDangerButton>
        <SDangerButton
          data-tip="Delete all of the keywords you've added from the watchlist"
          onClick={handleWatchlist}
        >
          Delete Watchlist
        </SDangerButton>
      </div>
    </SDangerSection>
  )
}
