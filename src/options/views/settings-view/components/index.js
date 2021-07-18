import React, { useEffect, useState } from "react";
import { permissionEnum } from "../../../../background/analysis/classModels";
import * as Icons from "../../../../libs/icons";
import {
  deleteEvidenceDB,
  deleteKeywordDB,
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
  SDangerButton,
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
    [permissionEnum.location]: true,
    [permissionEnum.monetization]: true,
    [permissionEnum.watchlist]: true,
    [permissionEnum.tracking]: true,
  });

  useEffect(() => {
    let componentMounted = true;

    getLabelStatus().then((res) => {
      if (componentMounted) SetLabelStatus(res);
    });
    return () => {
      componentMounted = false;
    };
  }, [labelStatus]);

  const toggle = (label) => {
    toggleLabel(label);
    const newLabelStatus = labelStatus;
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
  );
};
export const ExportData = () => (
  <SExportSection>
    <SExportButton>CSV</SExportButton>
    <SExportButton>JSON</SExportButton>
  </SExportSection>
);
export const DangerZone = () => {
  const handleEvidence = () => {
    if (
      confirm(
        "Are you sure you want to delete all of the evidence we've collected?"
      )
    ) {
      deleteEvidenceDB();
    }
  };

  const handleWatchlist = () => {
    if (
      confirm(
        "Are you sure you want to delete all of the keywords you've asked us to track?"
      )
    ) {
      deleteKeywordDB();
    }
  };
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
  );
};
