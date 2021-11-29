// This communicates with the hijackSockets file
// to listen to the bitsgap websocket and be able to send 
// messages based on it

let clbks = [];
window.addEventListener('message', ({data}) => {
  if(data.remoteSocket){
    clbks.forEach( clbk => clbk(data.msg));
  }
});


// It exposes an object from where we can listen to new
// data from the websocket, and send some data using it
export const socket = {
  addMessageListener( clbk ){
    clbks.push( clbk );
  },
  removeMessageLister( clbk ){
    let i = clbks.length;
    while(i--){
      if( clbk[i] === clbk ){
        clbks.splice(i, 1);
      }
    }
  },
  send( msg ){
    window.postMessage({remoteSocket: true, msg});
  }
}