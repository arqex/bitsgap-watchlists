import { socket } from "../bitsgapConnectors/getSocket.js";

let subscriptions = {
  'allPairs': [],
  'balances': []
}

let values = {

}

export const socketFeed = {
  startListening: () => {
    socket.addMessageListener( classifyMessages )
  },

  stopListening: () => {
    socket.removeMessageLister( classifyMessages )
  },

  subscribe(topic, clbk){
    if(!subscriptions[topic]){
      subscriptions[topic] = [];
    }
    subscriptions[topic].push(clbk);
  },
  unsubscribe(topic, clbk){
    if(!subscriptions[topic]) return;
    subscriptions[topic] = subscriptions[topic].filter( c => c !== clbk );
  },
  getValue(topic){
    return values[topic];
  }
}

function setValue(topic, value){
  values[topic] = value;
  if( subscriptions[topic] )
    subscriptions[topic].forEach( clbk => clbk() );
}

window.socket = socket;

function classifyMessages( message ){
  const proc = message?.skey?.proc;
  if( !proc ) return;
  const {value} = message;
  if( !value ) return;

  if( proc === 'v_conf_pairs_to' ){
    setValue('allPairs', value.markets);
  }
  else if( proc === 'app.markets.balance' ){
    setValue('balances', value.markets);
  }
  else if( proc === 'app.openorders' ){
    setValue(`openOrders:${message.skey.market}`, value.orders);
  }
}

function refreshMarketPairs(socket) {
  const skey = {"proc":"app.markets.balance","trade":"real"};
  subscribe(socket, skey);
  unsubscribe(socket, skey);
}

function refreshBalances(socket) {
  const skey = {"proc":"app.markets.balance","trade":"real"};
  userSubscribe(socket, skey);
  userUnsubscribe(socket, skey);
}

function refreshMarketOrders(socket, market) {
  const skey = {"proc":"app.openorders","market": market};
  userSubscribe(socket, skey);
  userUnsubscribe(socket, skey);
}


function subscribe( socket, skey ) {
  socket.send({"type":"push_subs","subs":"1","skey": skey});
}
function userSubscribe( socket, skey ) {
  socket.send({"type":"users_push_subs","subs":"1","skey": skey});
}
function unsubscribe(socket, skey) {
  socket.send({"type":"push_subs","subs":"00","skey": skey});
}
function userUnsubscribe(socket, skey) {
  socket.send({"type":"users_push_subs","subs":"00","skey": skey});
}