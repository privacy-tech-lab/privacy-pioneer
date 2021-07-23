/*
getLocationData.js
================================================================================
- getLocationData.js takes users lat and long uses Google Map API to find other
location info
- if location permission is denied by the user, returns [0,0] for user lat, lng
*/

/**
 * Uses the navigator API to get the users coordinates.
 * 
 * Defined, used in getLocationData.js
 * 
 * @returns {object} An object with properties long and lat
 */
const getCoords = async () => {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  // ex: if the user is in Middletown, this should return something near 
  // {72.6506, 41.5623}
  return {
    long: pos.coords.longitude,
    lat: pos.coords.latitude,
  };
};

/**
 * Calls getCoords to return an array containing [lat, long]. Returns [0,0] on error
 * 
 * Defined in getLocationData.js
 * 
 * Used in importSearch.js
 * 
 * @returns {Promise<Array<number>>} The coordinates of the user
 */
export async function getLocationData() {
  try {
    const coords = await getCoords();
    var lat = coords["lat"];
    var lng = coords["long"];
    return [lat, lng];
  } catch (e) {
    // location permission denied so lat, lng just = 0
    return [0, 0];
  }
}
