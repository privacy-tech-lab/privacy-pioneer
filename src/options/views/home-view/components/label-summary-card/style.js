import styled from "styled-components"

const getColor = (color) => {
  switch (color) {
    case "orange":
      return "linear-gradient(180deg, #efa493 0%, #e77f7e 100%)"
    case "purple":
      return "linear-gradient(180deg, #B7AFF2 0%, #5C7ADD 100%)"
    default:
      break
  }
}

export const SContainer = styled.div`
  margin-right: 32px;
  margin-top: 16px;
  width: 250px;
  height: 125px;
  box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: ${(props) => getColor(props.color)};
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 16px;
  color: white;
  path,
  circle {
    fill: white;
  }
`

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
`

export const STotal = styled.div`
  font-size: 64px;
  line-height: 32pt;
  font-weight: bold;
`

export const SLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  svg:first-of-type {
    margin-right: 4px;
  }
`

export const SFooter = styled.div`
  display: flex;
  margin-top: auto;
`
