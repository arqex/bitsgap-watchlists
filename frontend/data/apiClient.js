export const apiClient = {
  async loadWatchlists() {
    let results = await sendToBackend('getWatchlists', {});
    return results?.length ? results : []; // empty lists
  },

  async createWatchlist(watchlist) {
    return await sendToBackend('createWatchlist', {watchlist});
  },

  async deleteWatchlist(id) {
    return await sendToBackend('deleteWatchlist', {id});
  },

  async loadWatchlistPairs(id) {
    let results = await sendToBackend('getWatchlistPairs', {id});
    return results?.length ? results : [];
  },

  async addPairToWatchlist( watchlistId, pair ) {
    return await sendToBackend('addPairToWatchlist', {watchlistId, pair} );
  },

  async removePairFromWatchlist( watchlistId, pair ) {
    return await sendToBackend('removePairFromWatchlist', {watchlistId, pair} );
  }
}


function createId() {
  // If we want to do this right probably we would use
  // some standard like uuid
  return (Math.random()*10000000).toString();
}

// Communicate with the backend by messages
const backendPromises = {};
function sendToBackend(action, args) {
  const id = createId();
  return new Promise( resolve => {
    backendPromises[id] = resolve;
    window.postMessage({
      id,
      origin: 'bge:frontend',
      action,
      args
    });
  })
}

window.addEventListener('message', msg => {
  const data = msg?.data;
  if( data?.origin === 'bge:backend' ){
    let resolve = backendPromises[data.id];
    if( resolve ){
      delete backendPromises[data.id];
      return resolve(data.result );
    }
  }
});