# integrated-privacy-analysis

The idea of this project is to create a browser extension for web users that analyzes and visualizes interesting privacy facts of HTTP requests and related website behavior. For example, the following URL-encoded string contains the latitude and longitude of a device:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that a site is collecting location information. Observing such behaviors, a privacy label of a site could be created.

The crucial point here is that by examining HTTP requests we are able to find out what information concretely is stored on a server. Usually, we only observe:

1. the container of information (e.g., we see a cookie but do not know which information is in the cookie)
2. know a third party but do not know which information they receive
3. only see a permission use but do not know whether information is actually transimitted to a server

None of the existing tools really answers these questions.

## Development

Check that you have node and npm installed

```
node -v
```

```
npm -v
```

You can get node and npm [here](https://www.npmjs.com/get-npm).

In the root directory of the project, start by installing the dependencies by runnning:

```
npm install
```

To start the project, run:

```
npm start
```

- Runs the extension in the development mode.
- The popup, options, and background page will reload if you make edits.
- You will also see any lint errors in the console.

A `dev` folder will be generated in the root directory, housing the generated extension files. Firefox should automatically open with the extension installed. If not, you can follow the instructions [here](https://github.com/privacy-tech-lab/integrated-privacy-analysis/issues/12#issuecomment-776985944), where `dev` will be the new `src` folder.

## Production

Build the extension for production to the `dist` folder by running:

```
npm build
```

- The build is minified and the filenames include the hashes.
- It correctly bundles and optimizes the extension for the best performance.

The `web-ext` cli is included in the project. Learn more about packaging and signing for release at the [extension workshop](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).

## Possible Analysis Features and Techniques

1. Information collection: Does a site collect personal information (i.e., is personal data sent to a server of a site)? If so, which types (e.g., location, email address, phone numbers)? Techniques for identifying such information collection may be HTTP (POST) request interception, identifying form fields in frontend code, and permission or resource use of an app.
2. Information sharing: Does the site share personal information (i.e., is data sent to a server of a third party)? If so, which types and to which third parties? Techniques are principally the same as for 1. Identifying third party cookies, per 3, may also help with third party detection. Third party integrations via tracking pixels or federated logins may be useful to explore as well (for example, the Facebook tracking pixel or login with Google). The [Facebook Pixel Helper extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) may provide some inspiration for techniques. Are there fingerprinting libraries included? Is code from data brokers integrated in sites?
3. HTTP Cookies: Does the site use first or third party HTTP Cookies? If so, what data is contained in the cookies? HTTP cookies may be explored by intercepting HTTP requests and possibly accessing the browser storage of the site and analyzing it. Similar to cookies, is the site using local storage?
4. [Do Not Track (DNT)](https://en.wikipedia.org/wiki/Do_Not_Track): Is the site responding to DNT signals? If so, how? DNT settings may be tested by sending a DNT signal and check a site's response, if any.
5. [Global Privacy Control (GPC)](https://globalprivacycontrol.github.io/gpc-spec/): Is the site responding to GPC signals? Techniques to make such identification are similar to 4. In addition, the analysis can check whether the site has a .well-known.json page to clarify how it responds to GPC signals (as specified by the GPC draft specification; though, the .well-known.json page is not mandatory per the specification). We can test the response by trying to access the .well-known.json url and check whether that is possible and, if so, what the page says.
6. HTTPS: Is the site transmitting all data via HTTPS? Any unencrypted connection to a server, i.e., just over HTTP is a potential vulnerability. Thus, if our analysis of intercepted server requests encounters any unencrypted connections, it can be flagged. On a related note, maybe we can also check whether the certificate of a site is valid?
7. HTTP headers: Are the site's HTTP header settings privacy-protective? In particular, the analysis could examine the [CORS header](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). [Here](https://securityheaders.com/) is a general site testing for header settings. Maybe, we can do something similar in a narrower fashion targeted to privacy.
8. Privacy Policy: Does the site have a privacy policy? Depending on the other analysis results it may or may not need a privacy policy. If it does, is there a policy linked on the homepage as required, for example, by CalOPPA?
9. Do Not Sell My Information: If the site has users from California and all requirements for the applicability of the law are met, a site must allow users to opt out from the sale of personal information and implement mechanisms for doing so. In particular, there must be a link "Do Not Sell My Personal Information" on the homepage of the site.
10. Accessibility: Various laws, such as the CCPA, also require a site to be accessible. There are various accessibility checkers, for example, in form of [browser extensions](https://chrome.google.com/webstore/detail/siteimprove-accessibility/efcfolpjihicnikpmhnmphjhhpiclljc). Possibly, our analyzer could include such functionality as well.

## Publication

A potential paper could have three sections:

1. A theoretical discussion for a technique of analyzying HTTP requests
2. An implementation of that technique in a browser extension
3. A usability study on the browser extension (especially, on privacy labels)
