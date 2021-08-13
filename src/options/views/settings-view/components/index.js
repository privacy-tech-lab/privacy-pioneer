/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useRef, useState } from "react"
import {
  permissionEnum,
  timeRangeEnum,
} from "../../../../background/analysis/classModels"
import * as Icons from "../../../../libs/icons"
import {
  deleteEvidenceDB,
  deleteKeywordDB,
  getLabelStatus,
  getSnippetStatus,
  getTheme,
  setTheme,
  settingsEnum,
  startStopTour,
  toggleLabel,
  toggleSnippet,
} from "../../../../libs/settings"
import {
  SSubtitle,
  SSettingHeader,
  SSwitch,
  SKnob,
  SSwitchLabel,
  SThemeSection,
  SThemeIcon,
  SExportButton,
  SExportSection,
  SDangerSection,
  SLabelToggle,
  SDangerButton,
  SDropdown,
  SDropdownItem,
  SDropdownOptions,
  SDropdownSelection,
  SSnippetToggle,
  STourButton
} from "./style"
import { initiateDownload } from "../../../../exportData/initiateDownload"
import { exportTypeEnum } from "../../../../background/analysis/classModels.js"
import { useHistory } from "react-router"

export const ToggleSwitch = ({ isActive, label, onClick, spaceBetween }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      margin: "12px 8px 12px 0px",
      justifyContent: spaceBetween ? "space-between" : null,
    }}
  >
    <SSwitchLabel>{label}</SSwitchLabel>
    <SSwitch active={isActive} onClick={onClick}>
      <SKnob
        variants={{
          off: { x: 0 },
          on: { x: 28 },
        }}
        transition={{ type: "tween" }}
        initial={isActive ? "on" : "off"}
        animate={isActive ? "on" : "off"}
      />
    </SSwitch>
  </div>
)

export const FullSnippetToggle = () => {
  const [snippetStatus, setSnippetStatus] = useState(false);

  useEffect(() => {
    getSnippetStatus().then((res) => {
      setSnippetStatus(res)
    })
  })

  const toggle = () => {
    toggleSnippet()
    setSnippetStatus(!snippetStatus)
  }

  return (
    <SSnippetToggle>
        <ToggleSwitch
          isActive={snippetStatus}
          onClick={() => toggle()}
          label={"Save Full HTTP Requests"}
          spaceBetween
        />
    </SSnippetToggle>
  )
}

export const LabelToggle = () => {
  const [labelStatus, SetLabelStatus] = useState({
    [permissionEnum.location]: true,
    [permissionEnum.monetization]: true,
    [permissionEnum.watchlist]: true,
    [permissionEnum.tracking]: true,
  })

  useEffect(() => {
    let componentMounted = true

    getLabelStatus().then((res) => {
      if (componentMounted) SetLabelStatus(res)
    })
    return () => {
      componentMounted = false
    }
  }, [labelStatus])

  const toggle = (label) => {
    toggleLabel(label)
    const newLabelStatus = labelStatus
    let previousStatus = newLabelStatus[label]
    newLabelStatus[label] = !previousStatus
    SetLabelStatus(newLabelStatus)
  }

  return (
    <SLabelToggle>
      {Object.values(permissionEnum).map((label) => (
        <ToggleSwitch
          isActive={labelStatus[label]}
          onClick={() => toggle(label)}
          label={label.charAt(0).toUpperCase() + label.slice(1)}
          key={label}
          spaceBetween
        />
      ))}
    </SLabelToggle>
  )
}

export const ThemeSelection = ({ changeTheme }) => {
  const [selTheme, setSelTheme] = useState("")
  useEffect(
    () =>
      getTheme().then((res) => {
        if (res) setSelTheme(res)
      }),
    [selTheme]
  )

  const setETheme = async (theme) => {
    await setTheme(theme)
    setSelTheme(theme)
    changeTheme(theme)
  }
  return (
    <SThemeSection>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.light}
        whileHover={{ scale: 1.1 }}
        onTap={() => setETheme(settingsEnum.light)}
      >
        <Icons.Sun size={48} />
      </SThemeIcon>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.dark}
        whileHover={{ scale: 1.1 }}
        onTap={() => setETheme(settingsEnum.dark)}
      >
        <Icons.Moon size={48} />
      </SThemeIcon>
      <SThemeIcon
        theme={settingsEnum.sameAsSystem}
        selTheme={selTheme}
        whileHover={{ scale: 1.1 }}
        onTap={() => setETheme(settingsEnum.sameAsSystem)}
      >
        <Icons.Settings size={48} />
      </SThemeIcon>
    </SThemeSection>
  )
}
export const ExportData = () => {
  const [showDropdown, setDropdown] = useState(false)
  const [timeRange, setTimeRange] = useState(timeRangeEnum.allTime.timestamp)
  const [dropdownTitle, setTitle] = useState("All Time")
  const dropdownRef = useRef()
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
    <SExportSection>
      <SDropdown
        onClick={() => setDropdown((state) => !state)}
        ref={dropdownRef}
      >
        <SDropdownOptions show={showDropdown}>
          {Object.values(timeRangeEnum).map(({ timestamp, title }) => (
            <SDropdownItem
              onClick={() => {
                setTimeRange(timestamp)
                setTitle(title)
              }}
              key={title}
            >
              {title}
            </SDropdownItem>
          ))}
        </SDropdownOptions>
        <SDropdownSelection>
          {dropdownTitle}
          <Icons.ChevronDown size="24px" />
        </SDropdownSelection>
      </SDropdown>
      <SExportButton
        onClick={() => {
          initiateDownload(exportTypeEnum.TSV, timeRange)
        }}
      >
        TSV
      </SExportButton>
      <SExportButton
        onClick={() => initiateDownload(exportTypeEnum.JSON, timeRange)}
      >
        JSON
      </SExportButton>
    </SExportSection>
  )
}
export const DangerZone = () => {
  const handleEvidence = () => {
    if (
      confirm(
        "Are you sure you want to delete all of the evidence we've collected?"
      )
    ) {
      deleteEvidenceDB()
    }
  }

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
        <SDangerButton onClick={handleEvidence}>Delete Evidence</SDangerButton>
        <SDangerButton onClick={handleWatchlist}>
          Delete Watchlist
        </SDangerButton>
      </div>
    </SDangerSection>
  )
}

export const Tour = () => {

  const history = useHistory()
  
  const startTour = () => {
    startStopTour()
    history.push('/')
  }
  
  return (
  <STourButton onClick={
    startTour
  }>
    Tour
  </STourButton>
  )
}