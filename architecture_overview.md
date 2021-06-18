**High-level picture:**

### 1
  - We set up HTTP request listeners in background.js
  
  - In analyze.js, we have callbacks for these listeners. First we verify that we have a full request, and then in the resolveBuffer function after we've verified that we have a full request, we call our analysis functions on that request

### 2
- These functions can be found in searchFunctions.js.

- urlSearch looks for urls from the disconnect.me list,  fingerprintSearch looks for text that matches the list that we have compiled (found in src/assets/services.json), coordinateSearch looks for longitude and latitudes, and regexSearch matches regular expression patterns passed to it.

- Some of these functions, like regexSearch get passed user data from the watchlistKeyval.

### 3

- We format this user data as a list `[locCoords, networkKeywords, services]` returned by the importFunction in importSearchData.js. 

- `locCoords` use the getLocationData.js file which uses the navigator api to ask for the user's location. So, the location popup should come up here.

- `networkKeywords` grabs all the user data in the watchlistKeyval, runs the appropriate structured routines in structuredRoutines.js (reformats phone numbers with google's api for example), and then returns everything as a dictionary.

- `services` is the json from src/assets/staticJSONs.json. This contains important websites that regularly perform invasive procedures, and we alert users to instances of their use.

- Right now, this function is called on load `importData().then((data) => {` in background.js. Then, we pass data to the listeners. We have to alter this architecture to allow for intra-session changes in user data.

### 4

- If any of these functions flag evidence, they update the evidenceKeyval for the rootUrl of that request, by calling the addToEvidence function, passing in the evidence that they found as parameters.

- addToEvidence will create a new evidence object with the parameters it was passed, gets what is currently stored at that rootUrl, updates it with the new piece of evidence, and then sets the evidence for that rootUrl again.

### 5

- There are two indexedDb databases: evidenceKeyval and watchlistKeyval. evidenceKeyval is defined in openDB.js and watchlistKeyval is defined in libs/indexed-db/index.js. Both use async/await and have data persist across sessions.

- watchlistKeyval is populated when a user adds an item to their watchlist on the front-end. 

- In evidenceKeyval, we keep all of the evidence we have collected in our analysis. The keys to this store are rootUrls (i.e. nytimes.com or facebook.com) and the values are the evidence we have at these rootUrls.

### 6

- So, if you call `e = await evidenceKeyval.get(nytimes.com)`, e will point to a dictionary of evidence. This evidence is structured: permission -> type -> requestUrl -> evidence object

- There is a maximum of 4 pieces of unique evidence (unique defined by requestUrl) for a given subtype. So, in theory we could have 28 pieces of evidence for the location permission for a given rootUrl because there are 7 subtypes of location. You could see these subtypes in the privacyLabels enum found in classModels.js

### 7
- The structure for permission, type, and evidence objects can be found in classModels.js. So, throughout the backend, we always use permissionEnum or typeEnum to reference permissions and types. If a new function is written that calls the addToEvidence function, it should pass permission and type parameters from these enums. 

- In general, any strings that will be used throughout the codebase should be declared as an object in the classModels.js file.

- The front end uses the privacyLabels enum. The permissionEnum and typeEnum should have exactly the same naming conventions as the privacyLabels enum. If evidence is added with a permission that is not in privacyLabels or a subtype that is not in privacyLabels, it will not display on the front end, which iterates through evidence and looks for evidence that has permissions and types from privacyLabels.

### 8

- The frontend gets data from the backend (pulls from the evidenceKeyval) in the libs/indexed-db/index.js file. 

- More documentation of the frontend should be added. The high high level is that the popup displays the data for the website the user is currently on and the home page shows all of the labels we have in the evidenceKeyval.

