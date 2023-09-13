/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useRef, useState } from "react";
import { SBadgeGroup, SBadge } from "./style";
import { Evidence } from "../evidence";
import { Collapse } from "bootstrap";
import {
  privacyLabels,
  settingsModelsEnum,
} from "../../../../../background/analysis/classModels";
import { getAnalyticsStatus } from "../../../../indexed-db/settings";
import { handleClick } from "../../../../indexed-db/getAnalytics";

/**
 * The function `formatItemUserKeywords` takes a request object and formats the userKeyword property by
 * converting it into separate properties with unique keys.
 * @param {object} request - The `request` parameter is an object that contains different types of keywords. One
 * of the types is "userKeyword", which is an array of user-defined keywords. The function
 * `formatItemUserKeywords` takes this `request` object and formats it by appending an index number to
 * each user keyword.
 * @returns {object} The function `formatItemUserKeywords` returns either the formatted `newReq` object if it is
 * not empty, or the original `request` object if `newReq` is empty.
 */
const formatItemUserKeywords = (request) => {
  var newReq = {};
  for (const [type, eList] of Object.entries(request)) {
    if (type === "userKeyword") {
      for (var i = 0; i < eList.length; i++) {
        newReq[type + i.toString()] = eList[i];
      }
    }
  }
  return Object.keys(newReq).length > 0 ? newReq : request;
};

/**
 * Display of badges with sub types and collapse containing description and evidence
 * @param {object} obj
 * @param {object} obj.request our evidence object for this request
 * @param {string} obj.url the request url
 * @param {string} obj.label the associated label of this evidence
 */
export const Item = ({ request, url, label }) => {
  request = formatItemUserKeywords(request);
  const [evidence, setEvidence] = useState({
    request: null,
    label: null,
    type: null,
  });
  const collapseId = `${url}-${label}-collapse`;
  const containerRef = useRef();

  /**
   * Show/hide collapse and populate with evidence data
   * @param {event} event onClick event of the badge
   * @param {object} request our evidence object for this request
   * @param {string} type The type of evidence
   */
  function inflateCollapse(event, request, type) {
    // @ts-ignore
    setEvidence({ request: request, label: label, type: type });

    const target = event?.target;
    const collapse = new Collapse(document.getElementById(collapseId), {
      toggle: false,
    });

    if (
      document.getElementById(collapseId).classList.contains("show") &&
      target.classList.contains("active")
    ) {
      const matches = containerRef.current.querySelectorAll(".badge");
      matches.forEach(function (match) {
        match.classList.remove("active");
      });
      collapse.hide();
    } else {
      const matches = containerRef.current.querySelectorAll(".badge");
      matches.forEach(function (match) {
        match.classList.remove("active");
      });
      target.classList.add("active");
      collapse.show();
    }
  }

  return (
    <>
      <SBadgeGroup ref={containerRef}>
        {Object.entries(request).map(([type, request]) => {
          const ktype = type;
          type = type.startsWith("userKeyword") ? "userKeyword" : type;
          return (
            <SBadge
              key={ktype}
              className="badge"
              onClick={(event) => {
                //@ts-ignore
                inflateCollapse(event, request, type);
                const getAnalysis = async () => {
                  const status = await getAnalyticsStatus();
                  if (status == true) {
                    handleClick(
                      /* Gets Description Button (Tracking Pixel, Fine Location, IP, etc) and Third Party */
                      "Description Button: " +
                        type.toString() +
                        " Third Party: " +
                        url.toString(),
                      "ANY",
                      settingsModelsEnum.notApplicable,
                      url.toString(),
                      settingsModelsEnum.notApplicable
                    );
                  }
                };
                getAnalysis();
              }}
            >
              {privacyLabels[label]["types"][type]["displayName"]}
              {request.cookie ? ` 🍪` : null}
            </SBadge>
          );
        })}
      </SBadgeGroup>
      <Evidence
        request={evidence.request}
        collapseId={collapseId}
        label={evidence.label}
        type={evidence.type}
      />
    </>
  );
};
