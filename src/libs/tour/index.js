import JoyRide from "react-joyride";
import React from "react";

export const homeSteps = [
  {
    target: ".fbjqxs",
    content: "Welcome to Privacy Pioneer! This is a short tour that will help you get your bearings and understand our extension.",
    placement: 'center',
  },
  {
    target: ".kcaaTV",
    content:
      "Here is an overview of how your data is being sent across your internet usage. ",
  },
  {
    target: ".jeLpyY",
    content: "Here you will see the most recent collection of your data. ",
  },
  {
    target: ".dZYVxT",
    content:
      "Above is the website that collected or shared your data. Below you can see how your data is being sent."
  },
  {
    run: true,
    target: ".idEqqj",
    content: "Click on any card. When it pops up, you can click on the buttons to see more information. Click next to continue when you are ready.",
    spotlightClicks: true,
  },
  {
    target: ".jsXcyL",
    content: "Click here to see all of your browsing history",
    spotlightClicks: true,
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
      />
    </>
  );
};

export const seeAllSteps = [
  {
    target: ".iYoder",
    content: "Here you can enter a specific website domain you want to search for",
    disableScrolling: true,
    disableScrollParentFix: true,
    placement: 'bottom'
  },
  {
    target: ".bwvKIa",
    content: "You can click on the label types to enable/disable the type.",
    disableScrolling: true,
    placement: 'bottom',
  },
  {
    target: ".ilIRpL",
    content: "Click here to see your watchlist",
    spotlightClicks: true,
    hideFooter: true,
  },
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
          last: "Next",
          skip: "Exit tour",
        }}
      />
    </>
  );
};

export const watchlistSteps = [
  {
    target: ".fbjqxs",
    content: "Here you can add keywords that we will look for in your browsing data. If they ever show up, we will let you know.",
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  {
    target: ".ilIRpL",
    content: "Click here to control Privacy Pioneer's settings",
    spotlightClicks: true,
    hideFooter: true,
  },
];

export const WatchlistTour = ({ steps }) => {
  return (
    <>
      <JoyRide
        steps={steps}
        scrollToFirstStep={false}
        continuous={true}
        showSkipButton={true}
        locale={{
          last: "Next",
          skip: "Exit tour",
        }}
      />
    </>
  );
};

export const settingsSteps = [
  {
    target: ".ecXlte",
    content: "Here you can change how Privacy Pioneer works to fit your preferences.",
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  {
    target: ".ilIRpL",
    content: "Click here to read about Privacy Pioneer",
    spotlightClicks: true,
    hideFooter: true,
  },
];

export const SettingsTour = ({ steps }) => {
  return (
    <>
      <JoyRide
        steps={steps}
        scrollToFirstStep={false}
        continuous={true}
        showSkipButton={true}
        locale={{
          last: "Next",
          skip: "Exit tour",
        }}
      />
    </>
  );
};

export const aboutSteps = [
  {
    target: ".dBpMed",
    content: "Here you can learn more about Privacy Pioneer and what is actually going on on the internet.",
    disableScrolling: true,
    disableScrollParentFix: true,
    placement: 'top-end',
  },
  {
    target: ".dBpMed",
    content: "Thank you for using Privacy Pioneer! Please enjoy using our extension!",
    placement: "center",
  }
];

export const AboutTour = ({ steps }) => {
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
      />
    </>
  );
};