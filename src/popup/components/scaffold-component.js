const ScaffoldComponent = ({ navigationBar, body }) => { 

  const node = document.createElement('div')
  node.style = "display: flex; flex-direction: column;"
  node.appendChild(navigationBar)
  node.appendChild(body)
  return node
}

export default ScaffoldComponent
