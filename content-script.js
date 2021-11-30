(async () => {
  let {mount} = await import(chrome.runtime.getURL('frontend/Root.js'));
  mount( createRootNode() );
  loadSocketHijack();
  loadStyles();
})();


function createRootNode(){
  let rootNode = document.createElement('div');
  setStyles(rootNode, {
    position: 'absolute',
    top: '59px',
    left: '5px',
    bottom: '0px',
    width: '0px'
  });

  document.body.appendChild(rootNode);
  return rootNode;
}

function setStyles( node, styles ){
  for( let key in styles ){
    node.style[key] = styles[key];
  }
}

// This will load a script that will listen to the bitsgap websocket
function loadSocketHijack() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('frontend/scripts/hijackSockets.js')
  document.body.appendChild(script);
}

function loadStyles() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet'
  stylesheet.href = chrome.runtime.getURL('frontend/bitsgap-extension.css')
  document.head.appendChild(stylesheet);
}