# integrated-privacy-analysis

Privacy analysis code for integration in web and mobile apps

## Research Vision

### Dynamic App Analysis

Going beyond PrivacyFlash Pro, the idea is to create a privacy analytics suite that can be integrated into web and mobile apps and that dynamically analyzes the behavior of those apps. Static analysis, which is used in PrivacyFlash Pro, can lead to false positives and is somewhat limited in terms of what is analyzable (e.g., a permission is used, but is data sent off of the device?).

One way to understand the privacy behavior of an app is to look at its web traffic. To that end, an HTTP(S) interceptor can be integrated (e.g., here is an [example for iOS](https://blog.codavel.com/how-to-intercept-http-requests-on-an-ios-app)). The interceptor will analyze outgoing (and incoming?) web requests (POST, GET, PUT, DELETE, PATCH, ...). For example, the following URL-encoded string contains the latitude and longitude of a device:

> https%3A%2F%2Fwww.example.com%2Flocation%3Flat%3D32.715736%26lon%3D%20-117.161087

If such a string is sent via an HTTP POST request, it can be concluded that the app is collecting location information. This fact would be communicated to our server. Observing such behaviors over time a privacy map of an app would be created. The privacy map can be explored by developers via a dashboard that is connected to our server. The developer could use the privacy map to adjust the privacy behavior of their app. Various tools would be available to the developer for auditing their app, creating privacy policies, ... . It is possible to turn off this functionality in the app remotely. More generally, the developer can control the behavior of the SDK via the dashboard.

Functionality beyond the HTTP interceptor could be probing every mobile permission (via try ... catch) and probing for integrated libraries (again, using try ... catch to call, e.g., the Google Analytic API).

The privacy map could also be used to create user notices and privacy "nutrition" labels (e.g., as Apple requires in a few weeks from every app on the App Store).
