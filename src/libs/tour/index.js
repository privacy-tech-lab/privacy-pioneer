import JoyRide from "react-joyride";
import React from "react";

export const homeSteps = [
  {
    target: ".fbjqxs",
    content: (
      <div>
        Welcome to Privacy Pioneer! This is a short tour that will help you get your bearings and understand our extension.
      </div>),
    placement: 'center',
  },
  {
    target: ".kcaaTV",
    content: (
      <div>
        Here is an overview of how your data is being sent across your internet usage.
        <br/>
        1/6
      </div>)
  },
  {
    run: true,
    target: ".dZYVxT",
    content: (
      <div>
        Here you will see the most recent collection of your data.
        <br/>
        Click on any card. When it pops up, you can click on the buttons to see more information. Click next to continue when you are ready.
        <br/>
        2/6
      </div>),
    spotlightClicks: true,
  },
  {
    target: ".jsXcyL",
    content: (<div>
      Click here to see all of your browsing history.
      <br/>
      3/6
    </div>),
    spotlightClicks: false,
    hideFooter: true,
  },
];

export const HomeTour = ({ steps }) => {
  return (
    <>
      <JoyRide
        steps={steps}
        continuous={true}
        showSkipButton={true}
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
          }
        }}
      />
    </>
  );
};

export const seeAllSteps = [
  {
    target: ".filters",
    content: (<div>
      In the search bar, you can enter a specific website domain you want to search for. You can click on the label types to enable/disable the type.
      <br/>
      4/6
    </div>),
    disableScrolling: true,
    disableScrollParentFix: true,
    placement: 'bottom'
  },
  {
    target: ".jhSFJl",
    content: (<div>
      This is the navigation bar. Go to "Watchlist" to add keywords that we will look for in your browsing data. If they ever show up, we will let you know. Go to "Settings" to control Privacy Pioneer's settings. Go to "About" to learn more about Privacy Pioneer and what is actually happening with your data on the internet.
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
  return (
    <>
      <JoyRide
        steps={steps}
        scrollToFirstStep={false}
        continuous={true}
        showSkipButton={true}
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
          }
        }}
      />
    </>
  );
};