/*
getLocationData.js
================================================================================
- getLocationData.js takes users lat and long uses Google Map API to find other
location info
*/

// function to get the client's location data
export const getCoords = async () => {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
          long: pos.coords.longitude,
          lat: pos.coords.latitude,
        };

    };

// from client's location, makes api call to google maps to get other location
// info for later static search analysis
export async function getLocationData() {
  try {
    const coords = await getCoords();
    var lat = coords["lat"]
    var lng = coords["long"]
    
    var apikey = "0"
    var httpCallFront = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
    var httpCallBack = lat + "," + lng + "&key=" + apikey
    var httpCall = httpCallFront + httpCallBack

    let data = await fetch(httpCall);
    let response = await data.json();
    return [lat, lng, response]
  }
  catch (e) {
    // location permission denied so lat, lng just = 0
    return [0,0,0]
  }
}
