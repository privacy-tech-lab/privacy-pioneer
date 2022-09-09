/* Store functions corelate to actions for analytics 

*/

import { analyticsKeyval } from "./openDB";
import { hashTypeAndPermission } from "../../background/analysis/utility/util";

export async function getButtonPress (buttonName, timePressed) {
    const hash = hashTypeAndPermission(buttonName + timePressed.toString())

    await analyticsKeyval.set(hash, {
        buttonName,
        timePressed,
        //View Page
        //Website so we could see what websites users may check a certain location with twitter or etc
    })
}

export const handleClick = (item) => {
  
    (async() => await getButtonPress(item, new Date()))()
    console.log(item);
  }