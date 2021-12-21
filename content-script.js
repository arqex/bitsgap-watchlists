(async () => {
  loadUI();
  loadSocketHijack();
  loadStyles(chrome.runtime.getURL('frontend/bitsgap-extension.css'));
  loadStyles('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css');
  loadStyles('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/solid.min.css');
  loadStyles('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/regular.min.css');
})();

function loadUI() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('frontend/scripts/mount.js');
  script.type = 'module';
  document.body.appendChild(script);
}

// This will load a script that will listen to the bitsgap websocket
function loadSocketHijack() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('frontend/scripts/hijackSockets.js')
  document.body.appendChild(script);
}

function loadStyles(url) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet'
  stylesheet.href = url;
  document.head.appendChild(stylesheet);
}