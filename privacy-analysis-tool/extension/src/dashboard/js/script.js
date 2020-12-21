document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn").addEventListener("click", () => {
    const url = document.getElementById("input").value;
    chrome.tabs.update({ url: url });
  });
});
