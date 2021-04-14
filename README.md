# integrated-privacy-analysis

The idea of this project is to create a browser extension that helps users to understand the privacy implications of their visit to websites. For example, the following URL-encoded string contains the latitude and longitude of a device:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that a site is collecting location information from a user. Observing such behaviors, a privacy label of a site could be created to help the user get a better understanding of their privacy.

## Development

Ensure that you have [node and npm](https://www.npmjs.com/get-npm) installed.

In the root directory of the project, start by installing the dependencies by runnning:

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

## Directory Layout

```bash
.
├── src                 # Extension source code
|   |── assets          # Images and other public files used in the extension
|   |── background      # Code for extension background related tasks (Ex. HTTP analysis)
|   |── libs            # Utility functions and components used in frontend and background tasks
|   |── options         # Options page frontend SPA
|   |── popup           # Popup dialog view frontend SPA
|   └── manifest.json   # Extension metadata
└── ...
```

## Features

By analyzing the HTTP requests of a site, we want to understand where requests are being sent, i.e, the first or third party receiving a request. Once we know that, we can look for the following types of information in web requests:

1. Structured data (phone numbers, social security numbers, GPS coordinates)
2. Tracking pixels (Facebook, ...)
3. Fingerprinting libraries (fingerprint.js, ...)
4. Detecting pure HTTP requests (i.e., no encryption via HTTPS)

This is the current set of features for which we analyze the HTTP requests.

## Paper Publication

A potential paper could have three sections:

1. A theoretical discussion for a technique of analyzying HTTP requests
2. An implementation of that technique in a browser extension
3. A usability study on the browser extension (especially, on privacy labels)

The crucial point here is that by examining HTTP requests we are able to find out what information concretely is stored on a server. Usually, we only observe:

1. the container of information (e.g., we see a cookie but do not know which information is contained in the cookie)
2. know a third party but do not know which information it receives
3. only see a permission use but do not know whether information is actually transimitted to a server

None of the existing tools really answers these questions.
