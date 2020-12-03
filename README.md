# integrated-privacy-analysis

Privacy analysis code for integration in web and mobile apps

## Research Vision

### Dynamic App Analysis

Going beyond PrivacyFlash Pro, the idea of this project is to create a privacy analytics suite that can be integrated into web (and possibly mobile) apps and that analyzes the behavior of those apps. Static analysis, which is used in PrivacyFlash Pro, can lead to false positives and is somewhat limited in terms of what is analyzable (e.g., a permission is used, but is data sent off of the device?). Thus, we want to use dynamic analysis as much as possible.

One technique to understand the privacy behavior of an app is to look at its web traffic. To that end, an HTTP(S) interceptor can be integrated (e.g., here is an [example for iOS](https://blog.codavel.com/how-to-intercept-http-requests-on-an-ios-app)). The interceptor will analyze outgoing (and incoming?) HTTP requests (POST, GET, PUT, DELETE, PATCH, ...). For example, the following URL-encoded string contains the latitude and longitude of a device:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that the app is collecting location information. Observing such behaviors, a privacy map of an app would be created. The privacy map can be explored by developers via a dashboard that is connected to our server. The developer could use the privacy map to adjust the privacy behavior of their app. Various tools would be available to the developer for auditing their app.

The developer could be lead via a tutorial to trigger various functionalities of their app starting with the login process. Then, while the developer is stepping through the tutorial, the privacy behavior of the app is recorded in our privacy dashboard. The analysis results can then be mapped to concrete recommendations to improve the privacy of the app and to the requirements of privacy laws.

The privacy map could also be used to create user notices and privacy "nutrition" labels (e.g., as Apple requires from every app on the App Store).

### Architectural Overview

<p align="center">
  <img src="https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/master/architecture_overview.png" title="architecture overview">
<p>

### Analysis Features and Techniques

1. Information collection: Does the app collect personal information (i.e., is data sent to a server of the app developer)? If so, which types (e.g., location, email address, phone numbers)? Techniques for identifying such information collection may be HTTP (POST) request interception, identifying form fields in frontend code, and permission or resource use of an app.
2. Information sharing: Does the app share personal information (i.e., is data sent to a server of a third party)? If so, which types and to which third parties? Techniques are principally the same as for 1, though, there may be additional ones, e.g., try to make a call to a library and see if it succeeds. Identifying code that is associated with certain libraries or identifying third party names in code may be useful as well. Identifying third party cookies, per 3, may also help with third party detection. Third party integrations via tracking pixels or federated logins may be useful to explore as well (for example, the Facebook tracking pixel or login with Google). The [Facebook Pixel Helper extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) may provide some inspiration for techniques. Are there fingerprinting libraries included? Is code from data brokers integrated in sites? Another important point is that all of the aforementioned is happening via HTTP requests between the user and the app. But it certainly would be interesting to examine the relationship between the third parties and the app, e.g., is there direct HTTP communication between them? This could be the case if the app is connected via a databroker's API to their database. The difficult part is how to tap into that API?
3. HTTP Cookies: Does the app use first or third party HTTP Cookies? If so, what data is contained in the cookies? If the app is collecting cookies, it may be necessary to get a user's cookie consent and have a cookie banner on the site. Is there such banner? HTTP cookies may be explored by intercepting HTTP requests and possibly accessing the browser storage of the site and analyzing it. Similar to cookies, is the site using local storage?
4. [Do Not Track (DNT)](https://en.wikipedia.org/wiki/Do_Not_Track): Is the site responding to DNT signals? If so, how? DNT settings may be tested by sending a DNT signal and check a site's response, if any. Depending on the applicable law, the developer may also need to say in the privacy policy how the site responds to DNT signals. It may be possible to identify a link to the site's privacy policy (or ask the developer for it) and check whether it mentions DNT (searching for "DNT", "Do Not Track" and the like).
5. [Global Privacy Control (GPC)](https://globalprivacycontrol.github.io/gpc-spec/): Is the site responding to GPC signals? Techniques to make such identification are similar to 4. In addition, the analysis can check whether the site has a .well-known.json page to clarify how it responds to GPC signals (as specified by the GPC draft specification; though, the .well-known.json page is not mandatory per the specification). We can test the response by trying to access the .well-known.json url and check whether that is possible and, if so, what the page says.
6. HTTPS: Is the site transmitting all data via HTTPS? Any unencrypted connection to a server, i.e., just over HTTP is a potential vulnerability. Thus, if our analysis of intercepted server requests encounters any unencrypted connections, it can be flagged. On a related note, maybe we can also check whether the certificate of a site is valid?
7. HTTP headers: Are the site's HTTP header settings privacy-protective? In particular, the analysis could examine the [CORS header](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). [Here](https://securityheaders.com/) is a general site testing for header settings. Maybe, we can do something similar in a narrower fashion targeted to privacy.
8. Privacy Policy: Does the site have a privacy policy? Depending on the other analysis results it may or may not need a privacy policy. If it does, is there a policy linked on the homepage as required, for example, by CalOPPA?
9. Do Not Sell My Information: If the site has users from California and all requirements for the applicability of the law are met, a site must allow users to opt out from the sale of personal information and implement mechanisms for doing so. In particular, there must be a link "Do Not Sell My Personal Information" on the homepage of the site.
10. Accessibility: Various laws, such as the CCPA, also require a site to be accessible. There are various accessibility checkers, for example, in form of [browser extensions](https://chrome.google.com/webstore/detail/siteimprove-accessibility/efcfolpjihicnikpmhnmphjhhpiclljc). Possibly, our analyzer could include such functionality as well.

The analysis will reveal the privacy state of the app. Generally, we will have two types of recommendation for the developer:
1. Add a missing feature
2. Fix a broken feature
These missing or broken features can be mapped to specific laws and regulations.


## Development

1. Install [`node`](https://nodejs.org/en/download/), which should also include `npm`.

2. Clone the repository and change directory.

```
git clone https://github.com/privacy-tech-lab/integrated-privacy-analysis.git
cd integrated-privacy-analysis
```

3. Install npm dependencies

```
npm install
```

4. Run locally.

```
npm run analyze
```

## Files and Directories in the Repo

- `src/`: Contains the code.
- `src/main.js`: The entry point to integrated-privacy-analysis.
