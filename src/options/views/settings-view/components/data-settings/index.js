/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useRef, useState } from "react"
import {
  permissionEnum,
  timeRangeEnum,
} from "../../../../../background/analysis/classModels"
import * as Icons from "../../../../../libs/icons"
import { ToggleSwitch } from "../toggle-switch"
import {
  getLabelStatus,
  getSnippetStatus,
  getOptimizationStatus,
  getIPLayerStatus,
  toggleLabel,
  toggleSnippet,
  toggleOptimization,
  toggleIPLayerSetting
} from "../../../../../libs/indexed-db/settings"
import {
  SExportButton,
  SExportSection,
  SLabelToggle,
  SDropdown,
  SDropdownItem,
  SDropdownOptions,
  SDropdownSelection,
  SSnippetToggle,
} from "./style"
import { initiateDownload } from "../../../../../libs/exportData/initiateDownload"
import { exportTypeEnum } from "../../../../../background/analysis/classModels.js"

/**
 * Toggles whether the user views the full snippet of evidence
 */
export const FullSnippetToggle = () => {
  const [snippetStatus, setSnippetStatus] = useState(false)

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

/**
 * Toggles Optimization
 */
export const OptimizationToggle = () => {
  const [optimizationStatus, setOptimizationStatus] = useState(true)

  useEffect(() => {
    getOptimizationStatus().then((res) => {
      setOptimizationStatus(res)
    })
  })

  const toggleOptimize = () => {
    toggleOptimization()
    setOptimizationStatus(!optimizationStatus)
  }

  return (
    <SSnippetToggle>
      <ToggleSwitch
        isActive={optimizationStatus}
        onClick={() => toggleOptimize()}
        label={"Optimize Performance"}
        spaceBetween
      />
    </SSnippetToggle>
  )
}

export const IPLayerToggle = () => {
  const [ipLayerStatus, setIpLayerStatus] = useState(true);

  useEffect(() => {
    getIPLayerStatus().then((res) => {
      setIpLayerStatus(res)
    })
  });

  const toggleIPLayer = () => {
    toggleIPLayerSetting()
    setIpLayerStatus(!ipLayerStatus)
  }

  return (
    <SSnippetToggle>
      <ToggleSwitch
        isActive={ipLayerStatus}
        onClick={() => {
          if (!ipLayerStatus) {
            confirm(
              "We use an external API from ip-api.com that holds your ip address for one minute, and then deletes it from their database. Clicking 'OK' will add your public IP address to a special list within Privacy Pioneer. We will use this obtain extremely accurate location data to be searched for in your web traffic."
            )
              ? toggleIPLayer()
              : null
            } else {
              confirm(
                "Turning off this feature will give less accurate location data, but will not send your public IP to ip-api.com"
              ) 
              ? toggleIPLayer()
              : null
            }
          }
        }
        label={"Toggle IP Layer"}
        spaceBetween
      />
    </SSnippetToggle>
  )
}

/**
 * Toggles each label from user view
 */
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
/**
 * Button for exporting data in specific format and date range
 */
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
