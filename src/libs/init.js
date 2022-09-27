/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import ReactTooltip from "react-tooltip";
import { getWebsites, getLabels } from "./indexed-db/getIdbData";
import exData from "./tour/exData.json";
import { getTourStatus } from "./indexed-db/settings";
import {
  filterLabelObject,
  getPermMapping,
} from "../options/views/search-view/components/filter-search/components/filterLabels.js";

/**
 *
 * Sets given regions to example data for tour
 */
export const tourInit = ({ setTouring, setWebsites, setLabels }) => {
  setTouring(true);
  setWebsites(exData.labelArrayPerSite);
  setLabels(exData.dataJson);
  ReactTooltip.rebuild();
};

/**
 * Initializes Home-View regions. Makes call to the data base to populate data
 */
export const homeInit = ({ setWebsites, setLabels, setModal, setTouring }) => {
  getTourStatus().then((res) => {
    if (res) {
      tourInit({
        setTouring,
        setLabels,
        setModal,
        setWebsites,
      });
    } else {
      setTouring(false);
      getWebsites().then((websites) => {
        setWebsites(websites);
        getLabels().then((labels) => {
          setLabels(labels);
          ReactTooltip.rebuild();
        });
      });
    }
  });
  document
    .getElementById("detail-modal")
    .addEventListener("hidden.bs.modal", () => {
      setModal({ show: false });
    });
};

/**
 * Initializes Search-View regions. If location.region is not undefined, it
 * grabs data from previous page else it calls to the database
 */
export const searchInit = ({
  setTouring,
  setWebsites,
  setFilteredWebsites,
  setFilteredLabels,
  setLabels,
  location,
}) => {
  ReactTooltip.hide();
  getTourStatus().then((res) => {
    if (res) {
      setTouring(true);
      setWebsites(exData.labelArrayPerSite);
      setFilteredWebsites(exData.labelArrayPerSite);
      setFilteredLabels(exData.dataJson);
      setLabels(exData.dataJson);
      ReactTooltip.rebuild();
    } else {
      setTouring(false);
      // if we're not passed the getWebsites call from previous:
      if (location.region === undefined) {
        getWebsites().then((websites) => {
          setWebsites(websites);
          setFilteredWebsites(websites);
          getLabels().then((labels) => {
            setFilteredLabels(labels);
            setLabels(labels);
            ReactTooltip.rebuild();
          });
        });
      } else {
        if (location.region.labeltype === undefined) {
          setWebsites(location.region.websites);
          setFilteredWebsites(location.region.websites);
          setLabels(location.region.labels);
          setFilteredLabels(location.region.labels);
        } else {
          // case where we are passed a filter
          setWebsites(location.region.websites);
          setLabels(location.region.labels);
          const filteredLabels = filterLabelObject(
            location.region.labels,
            getPermMapping(location.region.labeltype)
          );

          // remove websites without labels after filter
          var filteredWebsites = {};
          for (const [perm, siteObject] of Object.entries(filteredLabels)) {
            for (const site of Object.keys(siteObject)) {
              filteredWebsites[site] = location.region.websites[site];
            }
          }
          // set values
          setFilteredLabels(filteredLabels);
          setFilteredWebsites(filteredWebsites);
        }
      }
    }
  });
};
