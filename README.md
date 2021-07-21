# integrated-privacy-analysis

<p align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/user/12247904/"><img src="https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/firefox-add-ons-badge.png" width="172px" alt="Firefox Add Ons badge"></a>
<p>

The idea of this browser extension is to helps users to understand the privacy implications of their visits to websites. For example, the following URL-encoded string contains the latitude and longitude of a device:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that a site is collecting location data. Observing such behaviors, a privacy profile of a site is created to help users get a better understanding of their privacy.

Currently, we only support Firefox.

## Development

Ensure that you have [node and npm](https://www.npmjs.com/get-npm) installed.

In the root directory of the project, start by installing the dependencies by running:

```bash
npm install --production=false
```

To start the project, run:

```bash
npm start
```

- Runs the extension in development mode
- The popup, options, and background page will reload if you make edits
- You will also see any lint errors in the console

A `dev` folder will be generated in the root directory, housing the generated extension files. Firefox should automatically open with the extension installed. If not, you can follow the instructions [here](https://github.com/privacy-tech-lab/integrated-privacy-analysis/issues/12#issuecomment-776985944), where `dev` will be the new `src` folder.

**NOTE:** If you experience errors regarding missing dependencies (usually due to a newly incorporated node package), delete the `node_modules` folder and then re-run the installation steps above. You may also want to delete `package-lock.json` along with the `node_modules` folder as a second attempt to solve this issue.

## Production

Build the extension for production to the `dist` folder by running:

```bash
npm run build
```

- The build is minified and the filenames include hashes
- It correctly bundles and optimizes the extension for the best performance

The `web-ext` cli is included in the project. Learn more about packaging and signing for release at the [extension workshop](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).

## Source Directory Layout

```bash
.
├── src                 # Extension source code
|   |── assets          # Images and other public files used in the extension
|   |── background      # Code for extension background related tasks (Ex. HTTP analysis)
|   |── libs            # Reusable utility functions and components used in frontend
|   |── options         # Options page frontend SPA
|   |── popup           # Popup dialog view frontend SPA
|   └── manifest.json   # Extension metadata
└── ...
```

The options and popup directories are similarly structured. Like many react projects they have an `index.html` file and `index.js` file which serve as the entry points. These directories also have a `components` directory, which contains reusable components to be used within it's parent directory, and a `views` directory, which contains page views (which are just more react components). Each component has an `index.js` file as an entry point to that component, and they may also contain a `style.js` file for scoped styling. For styling, we use a popular technique called CSS in JS to apply styles using the third party library, [styled components](https://styled-components.com). Styled components are prefixed with a `S`, e.g. `SContainer`. For more complex components or views, there may be an additional `components` directory. For transitions and animations, we use the third party library [framer motion](https://www.framer.com/motion/).

The `src/libs/indexed-db` directory, contains functions that communicate to the database.

## Privacy Practice Analysis

Our extension is analyzing the following privacy practices for each first and third party website.

- Monetization
  - Advertising (from Disconnect)
  - Analytics (from Disconnect)
  - Social Networking (Social from Disconnect)
- Location
  - Coarse Location
  - Tight Location
  - ZIP Code
  - Street Address
  - City
  - State
- Tracking
  - Tracking Pixel
  - IP Address
  - Browser Fingerprinting (FingerprintingInvasive from Disconnect, our own list)
- Watchlist
  - Phone Number
  - Email Address
  - Custom Keywords

## Extension Architecture

An overview of the architecture of our extension is available [separately](https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/architecture_overview.md).

## Third Party Libraries

This project uses the following third party libraries and resources. We thank the developers.

- [Bootstrap](https://getbootstrap.com)
- [Disconnect Tracker Protection lists](https://github.com/disconnectme/disconnect-tracking-protection)
- [Eva Icons](https://akveo.github.io/eva-icons/#/)
- [Framer Motion](https://www.framer.com/motion/)
- [iconmonstr](https://iconmonstr.com/)
- [Idb](https://www.npmjs.com/package/idb)
- [React Tooltip](https://www.npmjs.com/package/react-tooltip)
- [Ion Icons](https://ionicons.com)
- [JSDoc](https://www.npmjs.com/package/jsdoc)
- [Queue](https://www.npmjs.com/package/queue)
- [React](https://reactjs.org)
- [Radar Icon](https://www.svgrepo.com/svg/167040/radar)
- [React Spinners](https://www.npmjs.com/package/react-spinners)
- [Simple Icons](https://github.com/simple-icons/simple-icons)
- [Styled Components](https://styled-components.com)

<p align="center">
  <img src="https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/plt_logo.png" width="200px" height="200px" alt="privacy-tech-lab logo">
<p>
