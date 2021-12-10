window.addEventListener('message', ({data}) => {
  if( socket && data?.remoteSocket && data.origin === 'plugin' && data.type === 'selectPair' ){
    let pairData = data.msg;
    let selector = getPairSelector();
  }
});


export function getPairSelector() {
  // Get pair selector
  const selector = document.querySelectorAll('.status-bar__select')[1].children[0];
  
  // Get react fiber
  const selectorFiber = selector[ Object.keys(selector).find( key => key.includes('Fiber') ) ]
  
  // Open dropdown
  selectorFiber.return.pendingProps.onOpen()
  
  // Get pair list
  const pairList = document.querySelector('.pairs-list')
  
  // Get react fiber
  const pairListFiber = pairList[ Object.keys(selector).find( key => key.includes('Fiber') ) ]
  
  // Get onPairSelect method
  const onPairSelect = pairListFiber.child.child.pendingProps.data.onPairSelect;

  // Close dropdown
  selectorFiber.return.pendingProps.onOpen()

  return onPairSelect;
}
