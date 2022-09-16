/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import * as Icons from "../../../../libs/icons"
import {
  getTheme,
  setTheme,
  settingsEnum,
} from "../../../../libs/indexed-db/settings"

import styled from "styled-components"
import { motion } from "framer-motion"
import { handleClick } from "../../../../libs/indexed-db/getAnalytics"

const SThemeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const SThemeIcon = styled(motion.div)`
  display: flex;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  outline: ${(props) =>
    props.theme == props.selTheme ? "5px solid #6b219f" : null};
  border-radius: 50%;
`

/**
 * Theming section for Settings View
 */
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
        onTap={() => {
          setETheme(settingsEnum.light)
          handleClick(('Light Theme'), "Settings", null, null, null)
        }}
      >
        <Icons.Sun size={48} />
      </SThemeIcon>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.dark}
        whileHover={{ scale: 1.1 }}
        onTap={() => {
          setETheme(settingsEnum.dark)
          handleClick(('Dark Theme Setting'), "Settings", null, null, null)
        }}
      >
        <Icons.Moon size={48} />
      </SThemeIcon>
      <SThemeIcon
        theme={settingsEnum.sameAsSystem}
        selTheme={selTheme}
        whileHover={{ scale: 1.1 }}
        onTap={() => {
          setETheme(settingsEnum.sameAsSystem)
          handleClick(('Same as System Theme'), "Settings", null, null, null)
        }}
      >
        <Icons.Settings size={48} />
      </SThemeIcon>
    </SThemeSection>
  )
}
