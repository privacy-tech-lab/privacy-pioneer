<p align="center">
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/releases"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/privacy-tech-lab/privacy-pioneer"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/releases"><img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/privacy-tech-lab/privacy-pioneer"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/commits/main"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/privacy-tech-lab/privacy-pioneer"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/actions/workflows/node.js.yml"><img alt="GitHub forks" src="https://github.com/privacy-tech-lab/privacy-pioneer/actions/workflows/node.js.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/privacy-tech-lab/privacy-pioneer"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/privacy-tech-lab/privacy-pioneer"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/watchers"><img alt="GitHub watchers" src="https://img.shields.io/github/watchers/privacy-tech-lab/privacy-pioneer?style=social"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/privacy-tech-lab/privacy-pioneer?style=social"></a>
  <a href="https://github.com/privacy-tech-lab/privacy-pioneer/network/members"><img alt="GitHub forks" src="https://img.shields.io/github/forks/privacy-tech-lab/privacy-pioneer?style=social"></a>
</p>

<p align="center">
<img src="src\assets\logos\Moon.svg" width="250" height="250">
</p>

# Privacy Pioneer

The idea of Privacy Pioneer is to help people understand the privacy implications of their visits to websites. For example, the following URL-encoded string contains the latitude and longitude where a person is located:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that a site is collecting location data. Observing such behaviors, a privacy label of a site is created to help people get a better understanding of their privacy.

<!-- <p align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/user/12247904/"><img src="https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/firefox-add-ons-badge.png" alt="Firefox Add Ons badge" width = "125" height = "45"></a>
<p/> -->

Currently, we only support Firefox.

Privacy Pioneer is developed and maintained by **Daniel Goldelman (@danielgoldelman)**, **Logan Brown (@Lr-Brown)**, **Justin Casler (@JustinCasler)**, **Judeley Jean-Charles (@jjeancharles)**, and **Sebastian Zimmeck (@SebastianZimmeck)** of the [privacy-tech-lab](https://privacytechlab.org/). **Hamza Harkous (@harkous)** is also collaborating with the team on the research. **Owen Kaplan (@notowen333)**, **Rafael Goldstein (@rgoldstein01)**, and **David Baraka (@davebaraka)** contributed earlier.

Contact us with any questions or comments at sebastian@privacytechlab.org.

## 1. Research Publications

- Daniel Goldelman, Logan Brown, Justin Casler, Judeley Jean-Charles, Sebastian Zimmeck, [Privacy Pioneer: Automating the Creation of Privacy Labels for Websites](https://youtu.be/emENqmVxi7k), Talk @ Google, Online, October 2022
- Owen Kaplan, [Privacy Pioneer: Creating an Automated Data-Privacy UI for Web Browsers](https://doi.org/10.14418/wes01.1.2616), Undergraduate Honors Thesis, Wesleyan University, April 2022
- Owen Kaplan, Logan Brown, Daniel Goldelman, Sebastian Zimmeck [Creating Privacy Labels for the Web](http://summer21.research.wesleyan.edu/2021/07/27/creating-privacy-labels-for-the-web/), Summer Research 2021 Poster Session, Wesleyan University, Online, July 2021

## 2. Development

Ensure that you have [node and npm](https://www.npmjs.com/get-npm) installed.

In the root directory of the project, start by [installing the dependencies by running](https://github.com/privacy-tech-lab/privacy-pioneer/issues/249#issuecomment-885723394):

```bash
npm install --production=false
```

**Note**: Privacy Pioneer uses an external service, [ipinfo.io](https://ipinfo.io/), to automate the identification of a user's Location in web traffic of visited websites. For this purpose Privacy Pioneer sends a user's IP address to ipinfo.io when the user restarts the browser or makes changes to the Watchlist. According to ipinfo.io's terms, it will keep a user's IP address in its logs for 1 year but will not use it beyond log maintenance or share it with anyone.

Create a file `holdAPI.js` and save it in the `/src/libs/` folder with your ipinfo API token as follows:

```javascript
export const apiIPToken = "<your ipinfo API token>";
```

Be sure to not add your ipinfo API token to GitHub to avoid misuse.

To start the project, run:

```bash
npm start
```

- Runs Privacy Pioneer in development mode
- The popup, options, and background page will reload if you make edits
- You will also see any lint errors in the console

A `dev` folder will be generated in the root directory, housing the generated extension files. Firefox should automatically open with the extension installed. If not, you can follow the instructions [here](https://github.com/privacy-tech-lab/privacy-pioneer/issues/12#issuecomment-776985944), where `dev` will be the new `src` folder.

**NOTE:** If you experience errors regarding missing dependencies (usually due to a newly incorporated node package), delete the `node_modules` folder and then re-run the installation steps above. You may also want to delete `package-lock.json` along with the `node_modules` folder as a second attempt to solve this issue.


### Testing 

Privacy Pioneer uses Jest to run unit test in order to maintain the integraty of the extension. All test files live in ./src/tests. In order to create new test, either add tests to an existing file or create a new file that ends with `.test.js`

All tests will be run on the creation of a pull request. 

Learn more about [jest here](https://jestjs.io/)!

To run all existing tests locally, run: 

```bash
npm run tests
```

## 3. Production

Build Privacy Pioneer for production to the `dist` folder by running:

```bash
npm run build
```

- The build is minified and the filenames include hashes
- It correctly bundles and optimizes the extension for the best performance

The `web-ext` cli is included in the project. Learn more about packaging and signing for release at the [extension workshop](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).

## 4. Source Directory Layout

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

Some logos and other assets are [here](https://docs.google.com/spreadsheets/d/1pmWIdsZv_lEIl9b3XRVXY2qe4mA-wedEM9K9kzkHnY0/edit#gid=0).

## 5. Privacy Practice Analysis

Privacy Pioneer is analyzing the following privacy practices for each first and third party website.

- Monetization
  - Advertising (from Disconnect)
  - Analytics (from Disconnect)
  - Social Networking (Social from Disconnect)
- Location
  - GPS Location
  - ZIP Code
  - Street Address
  - City
  - Region
- Tracking
  - Tracking Pixel
  - IP Address
  - Browser Fingerprinting (FingerprintingInvasive from Disconnect, our own list)
- Watchlist
  - Phone Number
  - Email Address
  - Custom Keywords

## 6. Extension Architecture

An overview of the architecture of Privacy Pioneer is available [separately](https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/architecture_overview.md). (The document is up to date as of its most recent commit date. Later architectural changes are not reflected.)

## 7. Third Party Libraries and Resources

Privacy Pioneer uses various [third party libraries](https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/package.json).

It also uses the following resources.

- [Disconnect Tracker Protection lists](https://github.com/disconnectme/disconnect-tracking-protection)
- [Eva Icons](https://akveo.github.io/eva-icons/#/)
- [iconmonstr](https://iconmonstr.com/)
- [Ion Icons](https://ionicons.com)
- [Radar Icon](https://www.svgrepo.com/svg/167040/radar)
- [Simple Icons](https://github.com/simple-icons/simple-icons)

We thank the developers.

## 8. Thank You!

<p align="center"><strong>We would like to thank our financial supporters!</strong></p><br>

<p align="center">Major financial support provided by Google.</p>

<p align="center">
  <a href="https://research.google/outreach/research-scholar-program/recipients/?category=2022/">
    <img class="img-fluid" src="./google_logo.png" height="80px" alt="Google Logo">
  </a>
</p>

<p align="center">Additional financial support provided by the Anil Fernando Endowment and Wesleyan University.</p>

<p align="center">
  <a href="https://www.wesleyan.edu/mathcs/cs/index.html">
    <img class="img-fluid" src="./wesleyan_shield.png" height="70px" alt="Wesleyan University Logo">
  </a>
</p>

<p align="center">Conclusions reached or positions taken are our own and not necessarily those of our financial supporters, its trustees, officers, or staff.</p>

##

<p align="center">
  <a href="https://privacytechlab.org/"><img src="./plt_logo.png" width="200px" height="200px" alt="privacy-tech-lab logo"></a>
<p>
