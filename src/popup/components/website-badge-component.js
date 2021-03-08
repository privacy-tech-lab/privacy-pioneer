import WebsiteLogoComponent from "./website-logo-component.js"

const WebsiteBadgeComponent = ({}) => {
  const node = document.createElement("div")
  node.style = `
    display: flex;
    flex-direction: row; 
    align-items: center;
    margin-top: 16px;
  `
  node.appendChild(WebsiteLogoComponent({ isLarge: false, name: "C" }))
  node.insertAdjacentHTML("beforeend", /*html*/ `<span style="margin-left: 8px;">www.charboost.com</span>`)
  return node
}

export default WebsiteBadgeComponent
