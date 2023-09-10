/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { analyticsKeyval } from "./openDB";
import { hashTypeAndPermission } from "../../background/analysis/utility/util";

/**
 * @param {string} buttonName
 * @param {Date} timePressed
 * @param {string} view
 * @param {string} website
 * @param {string} thirdParty
 * @param {string} historyFilter
 */
export async function getButtonPress(
  buttonName,
  timePressed,
  view,
  website,
  thirdParty,
  historyFilter
) {
  const hash = hashTypeAndPermission(
    buttonName +
      timePressed.toString() +
      view +
      website +
      thirdParty +
      historyFilter
  );

  await analyticsKeyval.set(hash.toString(), {
    buttonName,
    timePressed,
    view, // Lets us know what page view the button was clicked at
    website, // Lets us know which website a label was clicked on
    thirdParty, // Lets us know which Third Party a label was clicked on
    historyFilter, //Lets us know what filters are on the current history
  });
}

//Check
/**
 * @param {string} button
 * @param {string} viewL
 * @param {string} websiteL
 * @param {string} thirdPartyL
 * @param {string} historyFilterL
 */
export function handleClick(button,
  viewL,
  websiteL,
  thirdPartyL,
  historyFilterL) {
  (async () => await getButtonPress(
    button,
    new Date(),
    viewL,
    websiteL,
    thirdPartyL,
    historyFilterL
  ))();
}
