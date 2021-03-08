import { chevronRightIcon, locationIcon, plusIcon } from "../utils/icons-util.js"
import SeperatorComponent from "./seperator-component.js"
import WebsiteBadgeComponent from "./website-badge-component.js"

const CardComponent = ({ labelName = "", id = "" }) => {
  const node = document.createElement("div")
  node.style = `
    display: flex; 
    flex-direction: column; 
    background-color: var(--cardColor);
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 16px;
    padding: 16px;
    border-radius: 16px;
    id=${id}
  `
  node.insertAdjacentHTML(
    "afterbegin",
    /*html*/ `
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
      <div style="display: flex; flex-direction: row; align-items: center;">
        <div style="height: 24px; width: 24px;">${locationIcon}</div>
        <span style="margin-left: 8px; font-weight: bold;">${labelName}</span>
      </div>
      <div style="height: 24px; width: 24px;">${chevronRightIcon}</div>
    </div>
    <div style="color: var(--secondaryTextColor); font-size: var(--body2); margin-top: 8px;">
      Amazon collected and shared your location data - <span style="font-weight: bold;">Coarse Location</span> with
      the following companies.
    </div>`
  )

  node.appendChild(SeperatorComponent({ marginBottom: "0px" }))
  const temp = [1, 2]
  temp.forEach((i) => {
    node.appendChild(WebsiteBadgeComponent({}))
  })

  node.insertAdjacentHTML(
    "beforeend",
    /*html*/ `      
    <div style="display: flex; flex-direction: row; align-items: center; margin-top: 16px;">
      <div style="height: 24px; width: 24px;">${plusIcon}</div>
      <span style="margin-left: 8px;">4 others</span>
    </div>`
  )
  
  node.addEventListener('click', () => {console.log('afasdf')});
  return node
}

export default CardComponent
