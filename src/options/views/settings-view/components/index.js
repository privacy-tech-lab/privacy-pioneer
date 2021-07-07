import React, { useEffect, useState } from "react";
import { permissionEnum } from "../../../../background/analysis/classModels";
import * as Icons from "../../../../libs/icons";
import {
  getLabelStatus,
  getTheme,
  setTheme,
  settingsEnum,
  toggleLabel,
} from "../../../../libs/settings";
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
} from "./style";

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
);

export const LabelToggle = () => {
  const [labelStatus, SetLabelStatus] = useState({
    [permissionEnum.monetization]: true,
    [permissionEnum.tracking]: true,
    [permissionEnum.location]: true,
    [permissionEnum.watchlist]: true,
  });

  useEffect(
    () =>
      getLabelStatus().then((res) => {
        if (res != {}) SetLabelStatus(res);
      }),
    []
  );
  const toggle = (label) => {
    toggleLabel(label);
    let newLabelStatus = labelStatus;
    let previousStatus = newLabelStatus[label];
    newLabelStatus[label] = !previousStatus;
    SetLabelStatus(newLabelStatus);
  };
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
  );
};

export const ThemeSelection = () => {
  const [selTheme, setSelTheme] = useState("");
  useEffect(
    () =>
      getTheme().then((res) => {
        setSelTheme(res), console.log(res);
      }),
    []
  );
  return (
    <SThemeSection>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.light}
        whileHover={{ scale: 1.1 }}
        onTap={async () => {
          await setTheme(settingsEnum.light), setSelTheme(settingsEnum.light);
        }}
      >
        <Icons.Sun size={48} />
      </SThemeIcon>
      <SThemeIcon
        selTheme={selTheme}
        theme={settingsEnum.dark}
        whileHover={{ scale: 1.1 }}
        onTap={async () => {
          await setTheme(settingsEnum.dark), setSelTheme(settingsEnum.dark);
        }}
      >
        <Icons.Sun size={48} />
      </SThemeIcon>
      <SThemeIcon
        theme={settingsEnum.sameAsSystem}
        selTheme={selTheme}
        whileHover={{ scale: 1.1 }}
        onTap={async () => {
          await setTheme(settingsEnum.sameAsSystem),
            setSelTheme(settingsEnum.sameAsSystem);
        }}
      >
        <Icons.Settings size={48} />
      </SThemeIcon>
    </SThemeSection>
  );
};
export const ExportData = () => (
  <SExportSection>
    <SExportButton>CSV</SExportButton>
    <SExportButton>JSON</SExportButton>
    <SExportButton>YAML</SExportButton>
  </SExportSection>
);
export const DangerZone = () => (
  <SDangerSection>
    <SSettingHeader>Danger Zone</SSettingHeader>
    <SSubtitle>Permenantly clear your stored data</SSubtitle>
  </SDangerSection>
);
