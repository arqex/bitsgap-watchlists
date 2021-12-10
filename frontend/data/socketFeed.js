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

export function refreshMarketPairs() {
  const skey = {"proc":"v_conf_pairs_to","trade":"real"};
  subscribe( skey);
  setTimeout( () => unsubscribe( skey ), 100);
}

export function refreshBalances() {
  const skey = {"proc":"app.markets.balance","trade":"real"};
  userSubscribe( skey);
  setTimeout( () => userUnsubscribe( skey), 100);
}

export function refreshMarketOrders( market ) {
  const skey = {"proc":"app.openorders","market": market};
  userSubscribe( skey);
  setTimeout( () => userUnsubscribe( skey), 100);
}


function subscribe( skey ) {
  socket.send({"type":"push_subs","subs":"1","skey": skey});
}
function userSubscribe( skey ) {
  socket.send({"type":"users_push_subs","subs":"1","skey": skey});
}
function unsubscribe(skey) {
  socket.send({"type":"push_subs","subs":"00","skey": skey});
}
function userUnsubscribe(skey) {
  socket.send({"type":"users_push_subs","subs":"00","skey": skey});
}