/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { analyticsKeyval } from "./openDB";
import { hashTypeAndPermission } from "../../background/analysis/utility/util";

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

  await analyticsKeyval.set(hash, {
    buttonName,
    timePressed,
    view, // Lets us know what page view the button was clicked at
    website, // Lets us know which website a label was clicked on
    thirdParty, // Lets us know which Third Party a label was clicked on
    historyFilter, //Lets us know what filters are on the current history
  });
}

export const handleClick = (
  button,
  viewL,
  websiteL,
  thirdPartyL,
  historyFilterL
) => {
  (async () =>
    await getButtonPress(
      button,
      new Date(),
      viewL,
      websiteL,
      thirdPartyL,
      historyFilterL
    ))();
};
