import JoyRide, {STATUS} from "react-joyride";
import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import { startStopTour, getTourStatus } from "../settings";

export const homeSteps = [
  {
    target: ".fbjqxs",
    content: (
      <div>
        Welcome to Privacy Pioneer! This is a short tour that will help you get your bearings and understand our extension.
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
    target: ".kcaaTV",
    content: (
      <div>
        See how your data is being sent across your internet usage.
        <br/>
        1/6
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
    target: ".dZYVxT",
    content: (
      <div>
        Here you will see the most recent collection of your data.
        <br/>
        Click on any card. When it pops up, you can click on the buttons to see more information.
        <br/>
        2/6
      </div>),
    spotlightClicks: true,
    styles: {
      options: {
        width: 440
      }
    }
  },
  {
    target: ".jsXcyL",
    content: (<div>
      Click here to see all of your browsing history.
      <br/>
      3/6
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
        disableOverlayClose={true}
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
          }
        }}
      />
    </>
  )
};

export const seeAllSteps = [
  {
    target: ".filters",
    content: (
      <div style={{
        display: 'flex'
        }}> 
        <p>
          In the search bar, you can enter a specific website domain you want to search for. You can click on the label types to enable/disable the type.
          <br/>
          4/6
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
    target: ".jhSFJl",
    content: (<div>
      This is the navigation bar. Use the Watchlist to look for custom keywords in your web traffic.
      <br/>
      5/6
    </div>),
  },
  {
    target: ".fbjqxs",
    content: (<div>
      Thank you for using Privacy Pioneer! Please enjoy using our extension!
      <br/>
      6/6
    </div>),
    placement: "center",
  }
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
    }
  }

  return (
    <>
      <JoyRide
        callback={checkEnd}
        disableOverlayClose={true}
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
          }
        }}
      />
    </>
  );
};