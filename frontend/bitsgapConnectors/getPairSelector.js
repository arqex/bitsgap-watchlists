export function getPairSelector() {
  // Get pair selector
  selector = document.querySelectorAll('.status-bar__select')[1].children[0];
  
  // Get react fiber
  selectorFiber = selector[ Object.keys(selector).find( key => key.includes('Fiber') ) ]
  
  // Open dropdown
  selectorFiber.return.pendingProps.onOpen()
  
  // Get pair list
  pairList = document.querySelector('.pairs-list')
  
  // Get react fiber
  pairListFiber = pairList[ Object.keys(selector).find( key => key.includes('Fiber') ) ]
  
  // Get onPairSelect method
  onPairSelect = pairListFiber.child.child.pendingProps.data.onPairSelect;

  // Close dropdown
  selectorFiber.return.pendingProps.onOpen()

  return onPairSelect;
}
