import cssToInject from "!!raw-loader!../dist/netlify-build-status-alert.min.css";
import markupToInject from "!!raw-loader!../dist/netlify-build-status-alert.min.html";

var BUILD_STATUS_URL = "/.netlify/functions/build-status";
var BUILD_STATUS_CHECK_INTERVAL = 3000;
var buildingAlertVisible = false;
var classHidden = "nbsa-util-hidden";
var idContainer = "netlify-build-status-alert";
var idBuildInProgress = "nbsa-build-in-progress";
var idBuildComplete = "nbsa-build-complete";
var idRefresh = "nbsa-action-refresh";

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function injectCSS() {
  var style = document.createElement("style");
  style.textContent = cssToInject;
  document.head.append(style);
}

function injectMarkup() {
  var containerDiv = document.createElement("div");
  containerDiv.id = idContainer;
  containerDiv.innerHTML = markupToInject;
  document.body.appendChild(containerDiv);

  document.getElementById(idRefresh).addEventListener("click", function () {
    window.location.reload();
  });
}

function handleBuildStatus(response) {
  if (response === "building") {
    if (!buildingAlertVisible) {
      injectCSS(cssToInject);
      injectMarkup(markupToInject);
      buildingAlertVisible = true;
      document.getElementById(idBuildInProgress).classList.remove(classHidden);
    }
    setTimeout(function () {
      httpGetAsync(BUILD_STATUS_URL, handleBuildStatus);
    }, BUILD_STATUS_CHECK_INTERVAL);
  } else if (response === "ready" && buildingAlertVisible) {
    document.getElementById(idBuildInProgress).classList.add(classHidden);
    document.getElementById(idBuildComplete).classList.remove(classHidden);
  } else {
    var $container = document.getElementById(idContainer);

    if ($container !== null) {
      $container.classList.add(classHidden);
    }
  }
}

httpGetAsync(BUILD_STATUS_URL, handleBuildStatus);
