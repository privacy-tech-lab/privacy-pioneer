/* Store functions corelate to actions for analytics 

*/

import { analyticsKeyval } from "./openDB";
import { hashTypeAndPermission } from "../../background/analysis/utility/util";

export async function getButtonPress (buttonName, timePressed, view, website, thirdParty, historyFilter) {
    const hash = hashTypeAndPermission(buttonName + timePressed.toString() + view + website + thirdParty + historyFilter)

    await analyticsKeyval.set(hash, {
        buttonName,
        timePressed,
        view, //Let us know what page view the button was clicked at
        website, //What website
        thirdParty, //Third Party
        historyFilter, //If history is being looked at then we filter
        //View Page
        //Website so we could see what websites users may check a certain location with twitter or etc
        //Filter
    })
}

export const handleClick = (button, viewL, websiteL, thirdPartyL, historyFilterL) => {
  
    (async() => await getButtonPress(button, new Date(), viewL, websiteL, thirdPartyL, historyFilterL))()
    console.log(button);
  }