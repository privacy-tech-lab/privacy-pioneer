/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";

import { startStopTour } from "../../../../libs/indexed-db/settings";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const STourButton = styled.div`
  display: flex;
  color: var(--primaryBrandColor);
  background-color: var(--primaryBrandTintColor);
  cursor: pointer;
  width: 100px;
  padding: 8px 0px;
  justify-content: center;
  font-weight: bold;
  margin-top: 12px;
  margin-right: 12px;
  border-radius: 8px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`;
/**
 * Settings for restarting the tour
 */
export const Tour = () => {
  const navigate = useNavigate();

  const startTour = async () => {
    await startStopTour();
    // Add a small delay to ensure the database write completes
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate("/");
  };

  return <STourButton onClick={startTour}>Tour</STourButton>;
};
