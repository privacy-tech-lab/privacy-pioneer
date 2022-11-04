/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useRef, useState } from "react";
import Scaffold from "../../components/scaffold";
import ReactTooltip from "react-tooltip";
import {
  STitle,
  SContainer,
  SSubtitle,
  SSettingHeader,
  SBody,
  SSection,
  SSeperator,
} from "./style";
import {
  FullSnippetToggle,
  OptimizationToggle,
  ExportData,
  LabelToggle,
  AnalyticsToggle,
} from "./components/data-settings";
import { ThemeSelection } from "./components/theme-settings";
import { DangerZone } from "./components/danger-settings";
import { Tour } from "./components/tour-settings";

/**
 * Settings page view to adjust various settings. All Settings are broken into seperate
 * components in order to cut down lines from main settings-view
 */
const SettingsView = ({ changeTheme }) => {
  useEffect(() => {
    ReactTooltip.rebuild();
    ReactTooltip.hide();
  }, []);
  return (
    <Scaffold>
      <SContainer>
        <STitle>Settings</STitle>
        <SSubtitle>Manage the extension</SSubtitle>
        <SBody>
          <SSection>
            {/* <ToggleSwitch label="Enabled" /> */}
            <SSettingHeader>Labels</SSettingHeader>
            <SSubtitle>Toggle which labels you want to track</SSubtitle>
            <LabelToggle />
            <SSettingHeader>Theme</SSettingHeader>
            <SSubtitle>Choose the theme of the extension</SSubtitle>
            <ThemeSelection changeTheme={changeTheme} />
          </SSection>
          <SSeperator marginLeft="32px" marginRight="32px" />
          <SSection>
            <div>
              <SSettingHeader>Export Data</SSettingHeader>
              <SSubtitle>
                Export all of the data and evidence from the extension
              </SSubtitle>
              <ExportData />
            </div>
            <DangerZone />
            <FullSnippetToggle />
            <OptimizationToggle />
            <AnalyticsToggle />
            <Tour />
          </SSection>
        </SBody>
      </SContainer>
    </Scaffold>
  );
};

export default SettingsView;
