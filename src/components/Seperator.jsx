import styled from "styled-components"

export default styled.div`
    display: flex;
    height: 1px;
    margin-left: ${(prop) => prop.marginLeft};
    margin-right: ${(prop) => prop.marginRight};
    background-color: var(--seperatorColor);
    margin-top: ${(prop) => prop.marginTop};
    margin-bottom: ${(prop) => prop.marginBottom};
`