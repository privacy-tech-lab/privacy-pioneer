var enteredKeyword = document.querySelector(".addKeyword input");
var addKeywordButton = document.querySelector(".addKeyword .keywordSubmit");
var clearStorageButton = document.querySelector(".addKeyword .clearStorage");

addKeywordButton.addEventListener('click', handleKeywordInput);
clearStorageButton.addEventListener('click', clearStorage);


async function handleKeywordInput() {
    // handle all keywords as lower
    var keyword = enteredKeyword.value.toLowerCase();
    let existingKeywords = await browser.storage.local.get("userKeywords");
    if (Object.values(existingKeywords)[0] == null) {
        browser.storage.local.set( { userKeywords: [keyword] } );
    }
    else {
        var updated = Object.values(existingKeywords)[0]
        repeatFlag = false
        updated.forEach(item => {if (item == keyword) {repeatFlag=true} } );
        if (!repeatFlag) {
            updated.push(keyword);
        }
        browser.storage.local.set( {userKeywords: updated } );
    }

    //example of how to iterate through saved keywords
    let currKeywords = await browser.storage.local.get("userKeywords");
    console.log(Object.values(currKeywords)[0]);
}

function clearStorage() {
    browser.storage.local.clear();
    console.log(browser.storage.local.get());
}