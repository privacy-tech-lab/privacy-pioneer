import styled from "styled-components";
import { permissionEnum } from "../../../../../background/analysis/classModels";

const getColor = (labeltype) => {
  switch (labeltype) {
    case permissionEnum.location:
      return "linear-gradient(180deg, #efa493 0%, #e77f7e 100%)";
    case permissionEnum.monetization:
      return "linear-gradient(180deg, #B7AFF2 0%, #5C7ADD 100%)";
    case permissionEnum.tracking:
      return "linear-gradient(180deg, #0BD0EA 0%, #0892a5 100%)";
    case permissionEnum.watchlist:
      return "linear-gradient(180deg, #F6D579 0%, #F5CB5C 100%)";
    default:
      return "linear-gradient(180deg, #FE486A 0%, #f2022e 100%)";
  }
};

export const SContainer = styled.div`
  margin-right: 24px;
  margin-top: 16px;
  height: 125px;
  flex: 0 0 225px;
  box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: ${(props) => getColor(props.labeltype)};
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 16px;
  color: white;
  path,
  circle {
    fill: white;
  }
`;

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
`;

export const STotal = styled.div`
  font-size: 64px;
  line-height: 32pt;
  font-weight: bold;
  margin-right: 16px;
`;

export const SLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  svg:first-of-type {
    margin-right: 4px;
  }
`;

export const SFooter = styled.div`
  display: flex;
  margin-top: auto;
`;
