const WebsiteLogoComponent = ({ isLarge = false, name }) => {
  const node = document.createElement("div")
  node.style = `
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${isLarge ? "64px" : "24px"}; 
    width: ${isLarge ? "64px" : "24px"}; 
    border-radius: 50%;
    background-color: var(--primaryBrandTintColor); 
    color: var(--primaryBrandColor);
    font-weight: bold;
    font-size: ${isLarge ? "32px" : "12px"};"
  `
  node.insertAdjacentHTML(
    "afterbegin",
    /*html*/ `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: ${isLarge ? "64px" : "24px"}; 
      width: ${isLarge ? "64px" : "24px"}; 
      border-radius: 50%;
      background-color: var(--primaryBrandTintColor); 
      color: var(--primaryBrandColor);
      font-weight: bold;
      font-size: ${isLarge ? "32px" : "12px"} ;"
      >
      ${name}
    </div>`
  )
  return node
}

export default WebsiteLogoComponent
