var BUILD_STATUS_URL =
  "https://magnificent-owl-e1bae.netlify.app/.netlify/functions/builds";
var BUILD_STATUS_CHECK_INTERVAL = 3000;
var buildingAlertVisible = false;
var classHidden = "nbsa-util-hidden";
var idContainer = "netlify-build-status-alert";
var idBuildInProgress = "nbsa-build-in-progress";
var idBuildComplete = "nbsa-build-complete";
var idRefresh = "nbsa-action-refresh";
// Minified version of src/netlify-build-status-alert.css
var cssToInject =
  "#netlify-build-status-alert{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;position:fixed;bottom:10px}#netlify-build-status-alert .nbsa-block{display:table;color:#e5e5e5;margin:10px;padding:20px;background-color:#293241;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:rgba(0,0,0,0.8) 0 0 10px;-moz-box-shadow:rgba(0,0,0,0.8) 0 0 10px;box-shadow:rgba(0,0,0,0.8) 0 0 10px}#netlify-build-status-alert .nbsa-block .nbsa-status-loading,#netlify-build-status-alert .nbsa-block .nbsa-status-complete{height:11px;width:11px;border-radius:50%;display:inline-block;margin-right:10px}#netlify-build-status-alert .nbsa-block .nbsa-status-loading{background-color:#fb8500;animation:heart-pulse 2s infinite ease-out}#netlify-build-status-alert .nbsa-block .nbsa-status-complete{background-color:#70e000}#netlify-build-status-alert .nbsa-block .nbsa-status,#netlify-build-status-alert .nbsa-block .nbsa-message,#netlify-build-status-alert .nbsa-block .nbsa-action{display:table-cell}#netlify-build-status-alert .nbsa-block .nbsa-action button{background-color:#e5e5e5;border:0;border-radius:25px;color:#293241;padding:5px 20px;text-align:center;text-decoration:none;display:inline-block;margin-left:10px;font-size:16px}#netlify-build-status-alert .nbsa-block .nbsa-action button:hover,#netlify-build-status-alert .nbsa-block .nbsa-action button:focus,#netlify-build-status-alert .nbsa-block .nbsa-action button:active{background-color:#2176ff;color:#e5e5e5;cursor:pointer}#netlify-build-status-alert .nbsa-block .nbsa-action button:active{background-color:#2176ffc0}.nbsa-util-hidden{display:none !important}@keyframes heart-pulse{0%{transform:scale(0)}50%{transform:scale(1.2)}70%{transform:scale(0.65)}100%{transform:scale(0)}}";
// Minified version of src/netlify-build-status-alert.html
var markupToInject =
  "<div id='nbsa-build-in-progress' class='nbsa-block nbsa-util-hidden'> <div class='nbsa-status'> <span class='nbsa-status-loading'></span> </div><div class='nbsa-message'> <span>Updating site. Will be ready in a few seconds.</span> </div></div><div id='nbsa-build-complete' class='nbsa-block nbsa-util-hidden'> <div class='nbsa-status'> <span class='nbsa-status-complete'></span> </div><div class='nbsa-message'> <span>Update complete.</span> </div><div class='nbsa-action'> <button id='nbsa-action-refresh'>Refresh Page</button> </div></div>";

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function injectCSS(css) {
  var style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
}

function injectMarkup(markup) {
  var containerDiv = document.createElement("div");
  containerDiv.id = idContainer;
  containerDiv.innerHTML = markup;
  document.body.appendChild(containerDiv);

  document.getElementById(idRefresh).addEventListener("click", function () {
    window.location.reload(true); // true for hard refresh
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
