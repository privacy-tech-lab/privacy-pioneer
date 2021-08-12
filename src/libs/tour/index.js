import JoyRide, {ACTIONS, STATUS} from "react-joyride";
import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import { startStopTour, getTourStatus } from "../settings";

export const homeSteps = [
  {
    target: "#navbarTour",
    content: (
      <div>
        Welcome to Privacy Pioneer! Let's get your bearings in a short tour, shall we...
      </div>),
    placement: 'center',
    locale: {
      skip: "Skip Tour",
      next: "Begin Tour"
    },
    styles: {
      options: {
        width: `440`,
      }
    }
  },
  {
    target: "#summaryTour",
    content: (
      <div>
        Learn how sites use and share your data in the Overview.
        <br/>
        1/5
        <br />
        <img src={'../assets/penguin_example.jpeg'} alt="Logo" style={{
          height: 200,
        }} />
      </div>),
    styles: {
      buttonBack: {
        display: 'none'
      },
    }
  },
  {
    run: true,
    target: "#websitesTour",
    content: (
      <div>
        See data from your most recent websites. Click a card or button to learn more.
        <br />
        2/5
      </div>),
    spotlightClicks: true,
    styles: {
      options: {
        width: 440
      }
    }
  },
  {
    target: "#seeAllTour",
    content: (<div>
      Click here to see all of your browsing history.
      <br/>
      3/5
    </div>),
    spotlightClicks: true,
    hideFooter: true,
  },
];

export const HomeTour = ({ steps }) => {
  const history = useHistory()

  const checkEnd = data => {
    const { action, index, status, type } = data;
    if (STATUS.FINISHED == status) {
      history.push("/search")
    } else if (STATUS.SKIPPED == status) {
      startStopTour()
      location.reload()
    } else if (ACTIONS.CLOSE == action) {
      startStopTour()
      location.reload()
    }
  }

  return (
    <>
      <JoyRide
        callback={checkEnd}
        steps={steps}
        continuous={true}
        showSkipButton={true}
        hideCloseButton={true}
        disableCloseOnEsc={true}
        locale={{
          last: "Next",
          skip: "Exit tour",
        }}
        styles={{
          options: {
            backgroundColor: `var(--backgroundColor)`,
            textColor: `var(--primaryTextColor)`,
          },
          buttonNext: {
            backgroundColor: `var(--primaryBrandTintColor)`,
            color: `var(--primaryBrandColor)`
          },
          buttonBack: {
            color: `var(--primaryTextColor)`
          },
          buttonClose: {
            display: "none"
          },
          spotlight: {
            borderRadius: 10
          }
        }}
      />
    </>
  )
};

export const seeAllSteps = [
  {
    target: "#filtersTour",
    content: (
      <div style={{
        display: 'flex'
        }}> 
        <p>
          Search for any website you visited. Use the filters to narrow down your results.
          <br/>
          4/5
        </p>
        <img src={'../assets/penguin_example.jpeg'} alt='Logo' style= {{
          height: 140,
          padding: 3
        }}/>
      </div>),
      disableScrolling: true,
      disableScrollParentFix: true,
      placement: 'bottom-start',
      placementBeacon: 'top',
      disableBeacon: true,
      styles: {
        options: {
          width: 400
        }
      }
  },
  {
    target: "#navbarTour",
    content: (<div>
      Use the Watchlist to keep track of custom keywords in your web traffic.
      <br/>
      Enjoy Privacy Pioneer!
      <br/>
      5/5
    </div>),
  },
];

export const SeeAllTour = ({ steps }) => {
  const history = useHistory()

  const checkEnd = data => {
    const { action, index, status, type } = data;
    if (STATUS.FINISHED == status) {
      startStopTour()
      history.push('/')
    } else if (STATUS.SKIPPED == status) {
      startStopTour()
      location.reload()
    } else if (ACTIONS.CLOSE == action) {
      startStopTour()
      location.reload()
    }
  }

  return (
    <>
      <JoyRide
        callback={checkEnd}
        steps={steps}
        scrollToFirstStep={false}
        continuous={true}
        showSkipButton={true}
        disableCloseOnEsc={true}
        locale={{
          last: "End Tour",
          skip: "Exit tour",
        }}
        styles={{
          options: {
            backgroundColor: `var(--backgroundColor)`,
            textColor: `var(--primaryTextColor)`,
          },
          buttonNext: {
            backgroundColor: `var(--primaryBrandTintColor)`,
            color: `var(--primaryBrandColor)`
          },
          buttonBack: {
            color: `var(--primaryTextColor)`
          },
          buttonClose: {
            display: "none"
          },
          spotlight: {
            borderRadius: 10
          }
        }}
      />
    </>
  );
};