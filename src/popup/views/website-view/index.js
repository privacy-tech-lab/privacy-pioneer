/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import { css } from "@emotion/react"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import * as Icons from "../../../libs/icons"
import {
  SLeading,
  SBrandIcon,
  SBrandTitle,
  STrailing,
  SBody,
  SHeader,
  STitle,
  SSubtitle,
  SIconWrapper,
  SLoader,
  SEmpty,
  SEmptyText,
} from "./style"
import NavBar from "../../components/nav-bar"
import { getWebsiteLabels } from "../../../libs/indexed-db/getIdbData.js"
import { getHostname } from "../../../background/analysis/utility/util.js"
import { useHistory } from "react-router"
import RiseLoader from "react-spinners/RiseLoader"

/**
 * Page view containing current website and identified label cards
 */
const WebsiteView = () => {
  const history = useHistory()
  const [website, setWebsite] = useState("...")
  const [labels, setLabels] = useState({})
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(true)
  const [ourOptions, setOurOptions] = useState(false)

  /**
   * Navigate to route in options page based on urlHash
   */
  const navigate = ({ urlHash = "" }) => {
    const url = browser.runtime.getURL("options.html")
    browser.tabs.query({ url: url }, function (tabs) {
      if (tabs.length) {
        browser.tabs.update(tabs[0].id, { active: true, url: url + urlHash })
        browser.tabs.reload()
      } else {
        browser.tabs.create({ url: url + urlHash })
      }
    })
    // closes the popup on navigation to options home or watchlist
    // removing the timeout breaks the code. may be a hacky solution
    setTimeout(() => window.close(), 10)
  }

  /**
   * Get number of privacy labels identified
   */
  const getCount = () => {
    const keys = Object.keys(labels)
    if (keys.length === 0) {
      return "0 Privacy Practices Identified"
    } else if (keys.length === 1) {
      return "1 Privacy Practice Identified"
    } else {
      return `${keys.length} Privacy Practices Identified`
    }
  }

  /**
   * Checks if current site is the extension's options page
   * @param {String} hostName
   */

  const checkOurOptions = (hostName) => {
    if (
      hostName.search(/moz-extension/) != -1 &&
      hostName.search(/options.html#/) != -1
    ) {
      setOurOptions(true)
    } else {
      setOurOptions(false)
    }
  }

  useEffect(() => {
    /**
     * Send message to background page to get url of active tab
     * Then set state of component with website url
     */
    const message = (request, sender, sendResponse) => {
      if (request.msg === "popup.currentTab") {
        const host = getHostname(request.data)
        checkOurOptions(request.data)
        getWebsiteLabels(host).then((labels) => {
          setLabels(labels)
          if (Object.keys(labels).length > 0) {
            setTimeout(() => {
              setEmpty(false), setLoading(false)
            }, 800)
          } else setTimeout(() => setLoading(false), 2000)
        })
        setWebsite(host)
      }
    }

    browser.runtime.onMessage.addListener(message)
    browser.runtime.sendMessage({ msg: "background.currentTab" })

    return () => {
      browser.runtime.onMessage.removeListener(message)
    }
  }, [])

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading>
              <SBrandIcon /> <SBrandTitle>Privacy Pioneer</SBrandTitle>
            </SLeading>
          }
          trailing={
            <STrailing>
              <SIconWrapper onClick={() => navigate({ urlHash: "#watchlist" })}>
                <Icons.Radar size="24px" />
              </SIconWrapper>
              <SIconWrapper onClick={() => navigate({ urlHash: "#" })}>
                <Icons.Home size="32px" />
              </SIconWrapper>
            </STrailing>
          }
        />
      }
      body={
        loading ? (
          <SLoader>
            <RiseLoader loading={loading} color={"#F2E8F9"} size={50} />
          </SLoader>
        ) : (
          <SBody>
            <SHeader>
              <WebsiteLogo
                large
                margin={"16px 0px 0px 0px"}
                website={website}
              />
              <STitle>{website}</STitle>
              <SSubtitle>{getCount()}</SSubtitle>
            </SHeader>
            {empty ? (
              ourOptions ? (
                <SEmpty>
                  <SEmptyText>
                    Nothing here ... Check elsewhere or come back later!
                  </SEmptyText>
                </SEmpty>
              ) : (
                <SEmpty>
                  <SEmptyText>
                    Nothing yet... Keep browsing and check back later!
                  </SEmptyText>
                </SEmpty>
              )
            ) : (
              Object.entries(labels).map(([label, requests]) => (
                <LabelCard
                  popup
                  key={label}
                  onTap={() =>
                    history.push({
                      pathname: `/website/${website}/label/${label}`,
                    })
                  }
                  margin="16px 16px 0px 16px"
                  label={label}
                  requests={requests}
                  website={website}
                />
              ))
            )}
          </SBody>
        )
      }
    />
  )
}

export default WebsiteView
