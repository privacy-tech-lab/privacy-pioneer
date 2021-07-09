/**
 * 
 * @param {string} email Email we want to create codes for based on UID 2.0 
 * @returns {string} Email without . in username and removes '+' and everything following in username
 */
function setEmail(email) {
  const at = email.search("@");
  var start = email.substring(0, at);
  const foot = email.substring(at, email.length);
  var newS1 = start.replace(".", "");
  var newS2 = newS1.replace(/\+.*/, "");
  return newS2 + foot;
}

/**
 * 
 * @param {string} email Email after setEmail()
 * @returns {Promise<string>} Hex of the email, SHA-256
 */
async function digestMessage(email) {
  const msgUint8 = new TextEncoder().encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * 
 * @param {string} hexStr String of the hexed email from digestMessage()
 * @returns Base 64 SHA-256 email as a string
 */
function hexToBase64(hexStr) {
  let base64 = "";
  for (let i = 0; i < hexStr.length; i++) {
    base64 += !((i - 1) & 1)
      ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16))
      : "";
  }
  return btoa(base64);
}

export {setEmail, digestMessage, hexToBase64}