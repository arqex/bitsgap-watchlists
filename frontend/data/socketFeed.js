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
  else if( proc === 'pairs' ){
    setPrices( message.skey.market, message.value );
  }
  else if( proc === 'rts' ){
    setPrice( message.skey.market, message.skey.pair, message.value )
  }
  else if( proc === 'sym1d.all' ){
    setPrices1dAgo( message.skey.market, message.value);
  }
  else if( proc === 'sym1d' ){
    setPrice1dAgo( message.skey.market, message.skey.pair, message.value);
  }
}

export function refreshMarketPairs() {
  const skey = {"proc":"v_conf_pairs_to","trade":"real"};
  subscribe( skey);
  setTimeout( () => unsubscribe( skey ), 1000);
}

export function refreshBalances() {
  const skey = {"proc":"app.markets.balance","trade":"real"};
  userSubscribe( skey);
  setTimeout( () => userUnsubscribe( skey), 1000);
}

export function refreshMarketOrders( market ) {
  const skey = {"proc":"app.openorders","market": market};
  userSubscribe( skey);
  setTimeout( () => userUnsubscribe( skey), 1000);
}

export function refreshPrice( market, symbol ){
  const skey = {"proc":"rts", "market": market, "pair": symbol};
  subscribe(skey);
  setTimeout( () => unsubscribe( skey ), 1000 );
}

export function refreshPrice1dAgo( market, symbol ){
  const skey = {"proc":"sym1d", "market": market, "pair": symbol};
  subscribe(skey);
  setTimeout( () => unsubscribe( skey ), 1000 );
}


function setPrices( market, values ){
  for( let pair in values ){
    setPrice(market, pair, values[pair]);
  }
}

function setPrice( market, pair, value ){
  setValue(`price:${market}:${pair}`, value);
}


function setPrices1dAgo( market, values ){
  for( let pair in values ){
    setPrice1dAgo(market, pair, values[pair]);
  }
}

function setPrice1dAgo( market, pair, value ){
  setValue(`1dAgo:${market}:${pair}`, value);
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