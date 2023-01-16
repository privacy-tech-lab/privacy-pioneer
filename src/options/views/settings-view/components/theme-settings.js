/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import * as Icons from "../../../../libs/icons";
import {
  getAnalyticsStatus,
  getTheme,
  setTheme,
  settingsEnum,
} from "../../../../libs/indexed-db/settings";

import styled from "styled-components";
import { motion } from "framer-motion";
import { handleClick } from "../../../../libs/indexed-db/getAnalytics";
import { settingsModelsEnum } from "../../../../background/analysis/classModels";

const SThemeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SThemeIcon = styled(motion.div)`
  display: flex;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  outline: ${(props) =>
    props.theme == props.selTheme ? "5px solid #6b219f" : null};
  border-radius: 50%;
`;
/**
 * Theming section for Settings View
 */
export const ThemeSelection = ({ changeTheme }) => {
  const [selTheme, setSelTheme] = useState("");
  useEffect(
    () =>
      getTheme().then((res) => {
        if (res) setSelTheme(res);
      }),
    [selTheme]
  );

  const setETheme = async (theme) => {
    await setTheme(theme);
    setSelTheme(theme);
    changeTheme(theme);
  };
  return (
    <SThemeSection>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.light}
        whileHover={{ scale: 1.1 }}
        onTap={() => {
          setETheme(settingsEnum.light);
          const getAnalysis = async () => {
            const status = await getAnalyticsStatus();
            if (status == true) {
              handleClick(
                "Light Theme",
                "Settings",
                settingsModelsEnum.notApplicable,
                settingsModelsEnum.notApplicable,
                settingsModelsEnum.notApplicable
              );
            }
          };
          getAnalysis();
        }}
      >
        <Icons.Sun size={48} />
      </SThemeIcon>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.dark}
        whileHover={{ scale: 1.1 }}
        onTap={() => {
          setETheme(settingsEnum.dark);
          const getAnalysis = async () => {
            const status = await getAnalyticsStatus();
            if (status == true) {
              handleClick(
                "Dark Theme Setting",
                "Settings",
                settingsModelsEnum.notApplicable,
                settingsModelsEnum.notApplicable,
                settingsModelsEnum.notApplicable
              );
            }
          };
          getAnalysis();
        }}
      >
        <Icons.Moon size={48} />
      </SThemeIcon>
    </SThemeSection>
  );
};
