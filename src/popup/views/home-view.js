import ScaffoldComponent from "../components/scaffold-component.js"
import NavigationBarComponent from "../components/navigation-bar-component.js"
import WebsiteLogoComponent from "../components/website-logo-component.js"
import CardComponent from "../components/card-component.js"

const HomeView = () => {
  const logo = () => {
    const node = document.createElement("div")
    node.style = "display: flex; flex-direction: row;"
    node.innerHTML = /*html*/ `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px; 
        width: 40px; 
        background-color: var(--primaryBrandTintColor); 
        color: var(--primaryBrandColor);
        border-radius: 8px;
        margin-left: 16px;
        margin-right: 16px;
        font-size: var(--headline);"
        >
        ?
      </div>
      <div style="display: flex; align-items: center; font-size: var(--headline);">
        Integrated Privacy Analysis
      </div>
    `
    return node
  }

  const spacer = () => {
    const node = document.createElement("div")
    node.style = "height: 16px;"
    return node
  }

  const websiteLogoWrapper = () => {
    const node = document.createElement("div")
    node.style = "align-self: center; margin-top: 16px;"
    node.appendChild(WebsiteLogoComponent({ name: "A", isLarge: true }))
    return node
  }

  const body = (data) => {
    const node = document.createElement("div")
    node.style = "display: flex; flex-direction: column;"
    node.appendChild(websiteLogoWrapper())
    node.insertAdjacentHTML(
      "beforeend",
      /*html*/ `
      <div style="align-self: center; font-weight: bold; font-size: var(--title2); margin-top: 8px;">
        www.amazon.com
      </div>
      <div style="align-self: center; margin-top: 4px; font-size: var(--body2); color: var(--secondaryTextColor);">
        3 privacy practices Identified
      </div>`
    )
    data.list.forEach((i) => {
      node.appendChild(CardComponent({ labelName: "Location", id: `card-label-${i}` }))
    })
    node.appendChild(spacer())
    return node
  }

  const dummyData = {
    label: "adfasd",
    list: [1, 2, 3],
  }

  return ScaffoldComponent({
    navigationBar: NavigationBarComponent({
      leading: logo(),
    }),
    body: body(dummyData),
  })
}

export default HomeView
