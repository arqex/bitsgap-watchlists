;(function (){
  hijackSocket( socket => {
    socket.addEventListener('message', sendMessageToPlugin);
  });

  function hijackSocket( onHijacked ) {
    let socket;
    console.log('Hijacking from file');

    const nativeSend = window.WebSocket.prototype.send;
    window.WebSocket.prototype.send = function(...args){
      if( this.url.includes('bitsgap') && this !== socket ){
        socket = this;
        if( socket ){
          onHijacked(socket);
        }
      }
      return nativeSend.apply(this, args);
    };


    window.addEventListener('message', ({data}) => {
      if( socket && data?.remoteSocket ){
        receiveMessageFromPlugin(socket, data.msg);
      }
    });
  }

  function sendMessageToPlugin(msg) {
    if( typeof msg.data === 'string' ){
      let ourMsg = {
        remoteSocket: true, // this is the flag in the message that says it's ours
        msg: JSON.parse(msg.data)
      }
      window.postMessage(ourMsg);
    }
    else {
      // There might be binary messages where the data is a BLOB
      console.log('Cant parse ws message');
    }
  }

  function receiveMessageFromPlugin(socket, msg){
    socket.send( JSON.stringify(msg) );
  }
})();
