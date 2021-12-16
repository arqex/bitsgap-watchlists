let store;

const STORE_KEY = 'bge_frontend_data';

const clbks = [];
export function addChangeListener( clbk ){
  clbks.push( clbk );
}

export function removeChangeListener( clbk ){
  clbks = clbks.filter( c => c !== clbk );
}

function emitChange() {
  clbks.forEach( clbk => clbk() );
}

function getStore() {
  if( store ) return store;

  try {
    store = JSON.parse( localStorage.getItem(STORE_KEY) );
  }
  catch {
    store = {};
  }
  
  return store;
}

function saveStore(data) {
  store = data;
  localStorage.setItem(STORE_KEY, JSON.stringify(data) );
  emitChange();
}

// Actions and accessors
export function saveLastWatchlistId( watchlistId ){
  let data = {
    ...getStore(),
    watchlistId
  };
  saveStore(data);
}

export function getLastWatchlistId(){
  return getStore().watchlistId;
}

export function saveLastExchangeInSelector(lastExchangeInSelector){
  let data = {
    ...getStore(),
    lastExchangeInSelector
  };
  saveStore(data);
}

export function getLastExchangeInSelector(){
  return getStore().lastExchangeInSelector;
}