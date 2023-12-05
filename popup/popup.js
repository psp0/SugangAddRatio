document.querySelector("button").addEventListener("click", function () {
  chrome.tabs.reload();
  chrome.runtime.reload();
});
