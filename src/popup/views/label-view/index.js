/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import * as Icons from "../../../libs/icons";
import { useNavigate, useParams } from "react-router-dom";
import { SLeading } from "./style";
import LabelDetail from "../../../libs/components/label-detail";
import NavBar from "../../components/nav-bar";
import {
  privacyLabels,
  settingsModelsEnum,
} from "../../../background/analysis/classModels";
import { getWebsiteLastVisitedEvidence } from "../../../libs/indexed-db/getIdbData.js";
import { getAnalyticsStatus } from "../../../libs/indexed-db/settings";
import { handleClick } from "../../../libs/indexed-db/getAnalytics";

/**
 * @param {object} labels 
 * @returns {number}
 */
function sortByTime(labels) {
  var newestTime = 0;
  for (const [labelL, value] of Object.entries(labels)) {
    for (const [url, typeVal] of Object.entries(value)) {
      for (const [type, e] of Object.entries(typeVal)) {
        //display the ipinfo labels
        if (Object.keys(privacyLabels["location"]["types"]).includes(type)) {
          for (let [a, b] of Object.entries(e)) {
            if (a == "timestamp") {
              if (b > newestTime) {
                newestTime = b;
              }
            }
          }
        }
      }
    }
  }
  return newestTime;
}

/**
 * Page view detailing information collected and shared.
 * Destination after clicking a 'label card'
 */
const LabelView = () => {
  const [requests, setRequests] = useState({});

  const navigate = useNavigate();
  const params = useParams();
  const website = params.website; // Get website passed from route
  const label = params.label; // Get label passed from route

  useEffect(
    () =>
      // @ts-ignore
      getWebsiteLastVisitedEvidence(website).then((result) => {
        const a = result?.[label] ?? {};
        setRequests(a);
      }),
    []
  );

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading
              onClick={() => {
                navigate("/", { replace: true });
                const getAnalysis = async () => {
                  const status = await getAnalyticsStatus();
                  if (status == true) {
                    handleClick(
                      "Go Back from Label Card (Website)",
                      "Website/Pop-up",
                      website.toString(),
                      settingsModelsEnum.notApplicable,
                      settingsModelsEnum.notApplicable
                    );
                  }
                };
                getAnalysis();
              }}
            >
              <Icons.Back size="24px" />
            </SLeading>
          }
          middle={privacyLabels[label]["displayName"]}
        />
      }
      body={
        Object.keys(requests).length ? (
          <LabelDetail website={website} label={label} requests={requests} />
        ) : null
      }
    />
  );
};

export { LabelView, sortByTime };
