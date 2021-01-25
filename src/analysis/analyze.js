/* 
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

function analyzeRequests(details) {
  console.log(details);
  try {
    if (details.url.split(':')[0] == 'http') {
      console.log('unencrypted request sent!')
    }
  }
  catch (error) { console.error(error)};
}

// function to check for https connection
// guaranteed a valid url
// log result to console for now
function httpsCheck(url) {
  if (url.split(':')[0] == 'http'){
    console.log(url.concat(' is unencrypted!'));
  }
  else {
    console.log(url.concat(' is encrypted!'));
  }
}

export { analyzeRequests }

export { httpsCheck }
