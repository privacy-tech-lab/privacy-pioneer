**High-level picture:**

### 1
  - We set up an HTTP request listener, `onBeforeRequest` in background.js
  
  - In analyze.js, we have a callback for this listener. We take the information we analyze from the callback data, and then pass the result to `resolveBuffer`, where we call our analysis functions on that request

### 2
- These functions can be found in searchFunctions.js.

- `locationKeywordSearch` looks for user inputted location elements, `urlSearch` takes Firefox's url classifications from the disconnect.me list, `coordinateSearch` looks for longitude and latitudes, `regexSearch` matches regular expression patterns passed to it, `fingerprintSearch` looks for text that matches the list that we have compiled (`src/assets/services.json`), `pixelSearch` looks for urls on our pixel list (`src/assets/keywords.json`), `dynamicPixelSearch` looks for common properties of a pixel, `ipSearch` looks for inputted IP addresses sent to 3rd parties, and `encodedEmailSearch` looks for emails that have been encoded in a few ways being sent to 3rd parties.

- Some of these functions, like `locationKeywordSearch`, `regexSearch`, and `ipSearch` get passed user data from the watchlistKeyval and the IP address-based dynamic data generation via ipinfo.io.

### 3

- We format this user data as a list `[locCoords, networkKeywords, services, fullSnippet, optimizePerformance, currIpInfo]` returned by the `importData()` function in `importSearchData.js`. 

- `locCoords` use the getLocationData.js file which uses the navigator api to ask for the user's location. So, the location popup should come up here.

- `networkKeywords` grabs all the user data in the watchlistKeyval, runs the appropriate structured routines in structuredRoutines.js (reformats phone numbers with google's api for example), and then returns everything as a dictionary.

- `services` is the json from `src/assets/services.json`. This contains important websites that regularly perform invasive procedures, and we alert users to instances of their use.

- `fullSnippet` is the user's choice to or not to store full HTTP snippets

- `optimizePerformance` is the user's choice to or not to optimize performance

- `currIpInfo` isthe user's current location and IP address as provided by ipinfo.io]

- This function is called on load `importData().then((data) => {` in background.js. Then, we pass data to the listeners. If the user changes a value, either a setting or a watchlist item, `importData()` will be called again.

### 4

- For each HTTP Reqeust, we call all analysis routines. Once the analysis is complete, we pass its result to `addToEvidenceStore` found in `addEvidence.js`.

- `addToEvidenceStore` will take the passed evidence and interact with the database. We do not add duplicate evidence. Duplicate evidence is defined as the same root/reqUrl and the same permission/type. Example: The exact same request that gets tagged as `monetizaiton` is handled twice.

### 5

- There are three indexedDb databases: evidenceKeyval, watchlistKeyval, and settingsKeyval. evidenceKeyval is defined in `analysis/interactDB/openDB.js`, watchlistKeyval and settingsKeyval are defined in `libs/indexed-db/openDB.js`. Both use async/await and have data persist across sessions. We use this [library](https://github.com/jakearchibald/idb) to wrap the DB.

- watchlistKeyval/settingsKeyval are populated when a user interacts with the front-end. 

- In evidenceKeyval, we keep all of the evidence we have collected in our analysis. The keys to this store are rootUrls (i.e. nytimes.com or facebook.com) and the values are the evidence we have at these rootUrls.

### 6

- So, if you call `e = await evidenceKeyval.get(nytimes.com)`, e will point to a dictionary of evidence. This evidence is structured: permission -> type -> requestUrl -> evidence object


### 7
- The structure for permission, type, and evidence objects can be found in classModels.js. So, throughout the backend, we always use permissionEnum or typeEnum to reference permissions and types. If a new function is written that calls the addToEvidence function, it should pass permission and type parameters from these enums. 

- In general, any strings that will be used throughout the codebase should be declared as an object in the classModels.js file.

- The front end uses the privacyLabels enum. The permissionEnum and typeEnum should have exactly the same naming conventions as the privacyLabels enum. If evidence is added with a permission that is not in privacyLabels or a subtype that is not in privacyLabels, it will not display on the front end, which iterates through evidence and looks for evidence that has permissions and types from privacyLabels.

### 8

- The frontend gets data from the backend (pulls from the evidenceKeyval) in the libs/indexed-db/index.js file. 

- More documentation of the frontend should be added. The high high level is that the popup displays the data for the website the user is currently on and the home page shows all of the labels we have in the evidenceKeyval.

