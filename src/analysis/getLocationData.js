/*
getLocationData.js
================================================================================
- getLocationData.js takes users lat and long uses Google Map API to find other
location info
*/

// function to get the client's location data
const getCoords = async () => {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
          long: pos.coords.longitude,
          lat: pos.coords.latitude,
        };
    };

// Given the geolocation list, parse through the geocode response and get the
// info we need such as street, zip code, city, state, etc.
export function filterGeocodeResponse(response) {
  // list of state abbreviations we want to exclude as they are too small
  // and will show up when they don't actually mean location
    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    let d = response[2]
    let lst = d["results"][0]["address_components"]
    var locElems = []
    // adds all the different components of the location address to list
    for (var i = 0; i < lst.length; i++) {
      const obj = lst[i]

      if (locElems.indexOf(obj["long_name"]) === -1) {
        // if the element is just an int we don't want it
        if (!(/^\d+$/.test(obj["long_name"]))) {
          // we don't want country or state codes either
          if (!(obj["long_name"] == "US" || states.includes(obj["long_name"]))) {
            locElems.push(obj["long_name"]);
          }
        }
      }

      if (locElems.indexOf(obj["short_name"]) === -1) {
        // if the element is just an int we don't want it
        if (!(/^\d+$/.test(obj["short_name"]))) {
          // we don't want country or state codes either
          if (!(obj["short_name"] == "US" || states.includes(obj["short_name"]))) {
            locElems.push(obj["short_name"]);
          }
        }
      }
    }
    return locElems
  }

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
