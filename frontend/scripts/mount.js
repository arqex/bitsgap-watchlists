import {mount} from '../Root.js';
mount( createRootNode() );

function createRootNode(){
  let rootNode = document.createElement('div');
  setStyles(rootNode, {
    position: 'absolute',
    top: '0px',
    left: '0px',
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