const SeperatorComponent = ({marginTop ='16px', marginBottom = "16px" }) => {
  const node = document.createElement("div")
  node.style = `
    display: flex;
    height: 1px;
    width: 100%;
    background-color: var(--seperatorColor);
    margin-top: ${marginTop};
    margin-bottom: ${marginBottom};
  `
  return node
}

export default SeperatorComponent
