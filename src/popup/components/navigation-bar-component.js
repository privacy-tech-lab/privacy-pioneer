const NavigationBarComponent = ({ leading, middle, trailing }) => {
  const node = document.createElement("div")
  node.style = `
    display: flex;
    min-height: 56px;
    height: 56px;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid var(--seperatorColor);
  `
  if (leading != null) node.appendChild(leading)
  if (middle != null) node.appendChild(middle)
  if (trailing != null) node.appendChild(trailing)
  return node
}

export default NavigationBarComponent
