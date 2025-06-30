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
} from "../options/views/search-view/components/filter-search/components/utils/filter-util";

/**
 * Sets given regions to example data for tour
 * @param {object} obj
 * @param {function(boolean):void} obj.setTouring
 * @param {function(object):void} obj.setWebsites
 * @param {function(object):void} obj.setLabels
 */
export const tourInit = ({ setTouring, setWebsites, setLabels }) => {
  setTouring(true);
  setWebsites(exData.labelArrayPerSite);
  setLabels(exData.dataJson);
  ReactTooltip.rebuild();
};

/**
 * Initializes Home-View regions. Makes call to the data base to populate data
 * @param {object} obj
 * @param {function(boolean):void} obj.setTouring
 * @param {function(object):void} obj.setWebsites
 * @param {function(object):void} obj.setLabels
 * @param {function(object):void} obj.setModal
 */
export const homeInit = ({ setTouring, setWebsites, setLabels, setModal }) => {
  getTourStatus().then((res) => {
    if (res) {
      tourInit({
        setTouring,
        setLabels,
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
  //@ts-ignore
  document
    .getElementById("detail-modal")
    .addEventListener("hidden.bs.modal", () => {
      setModal({ show: false });
    });
};

/**
 * Initializes Search-View regions. If location.region is not undefined, it
 * grabs data from previous page else it calls to the database
 * @param {object} obj
 * @param {function(boolean):void} obj.setTouring
 * @param {function(object):void} obj.setWebsites
 * @param {function(object):void} obj.setLabels
 * @param {function(object):void} obj.setFilteredWebsites
 * @param {function(object):void} obj.setFilteredLabels
 * @param {object} obj.location
 */
export const searchInit = ({
  setTouring,
  setWebsites,
  setLabels,
  setFilteredWebsites,
  setFilteredLabels,
  location,
}) => {
  ReactTooltip.hide();
  getTourStatus().then((res) => {
    if (res) {
      setWebsites(exData.labelArrayPerSite);
      setFilteredWebsites(exData.labelArrayPerSite);
      setFilteredLabels(exData.dataJson);
      setLabels(exData.dataJson);
      ReactTooltip.rebuild();
      // Delay tour start to ensure DOM is ready and positioned correctly
      setTimeout(() => {
        console.log("Starting tour after DOM is ready");
        setTouring(true);
      }, 100);
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
