/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import * as Icons from "../../../libs/icons";
import { useHistory, useParams } from "react-router-dom";
import { SLeading } from "./style";
import LabelDetail from "../../../libs/components/label-detail";
import NavBar from "../../components/nav-bar";
import {
  permissionEnum,
  privacyLabels,
} from "../../../background/analysis/classModels";
import { getWebsiteLabels } from "../../../libs/indexed-db/getIdbData.js";
import { evidenceKeyval as evidenceIDB } from "../../../background/analysis/interactDB/openDB.js";
import {
  IPINFO_IPKEY,
  IPINFO_ADDRESSKEY,
} from "../../../background/analysis/buildUserData/importSearchData.js";

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

  const history = useHistory();
  const params = useParams();
  const website = params.website; // Get website passed from route
  const label = params.label; // Get label passed from route

  useEffect(
    () =>
      getWebsiteLabels(website).then((labels) => {
        //Gets the newest entry's timestamp

        const currentTime = sortByTime(labels);

        var result = {};
        for (const [labelL, value] of Object.entries(labels)) {
          if (
            labelL != permissionEnum.location &&
            labelL != permissionEnum.tracking
          ) {
            result[labelL] = value;
          } else {
            for (const [url, typeVal] of Object.entries(value)) {
              for (const [type, e] of Object.entries(typeVal)) {
                //display the ipinfo labels

                //Check if the evidence has been added recently
                var timestamp = currentTime - e["timestamp"] < 1000000;
                if (
                  (e["watchlistHash"] == IPINFO_IPKEY || IPINFO_ADDRESSKEY) &&
                  timestamp
                ) {
                  if (!(labelL in result)) {
                    result[labelL] = { [url]: { [type]: e } };
                  } else if (!(url in result[labelL])) {
                    result[labelL][url] = { [type]: e };
                  } else {
                    result[labelL][url][type] = e;
                  }
                } else if (
                  !(typeof e["watchlistHash"] === "string") &&
                  timestamp
                ) {
                  // Add label in data to object
                  if (!(labelL in result)) {
                    result[labelL] = { [url]: { [type]: e } };
                  } else if (!(url in result[labelL])) {
                    result[labelL][url] = { [type]: e };
                  } else {
                    result[labelL][url][type] = e;
                  }
                }
              }
            }
          }
        }
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
            <SLeading onClick={() => history.replace({ pathname: `/` })}>
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
