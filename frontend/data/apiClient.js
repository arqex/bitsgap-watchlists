export const apiClient = {
  async loadWatchlists() {
    let results = await getValues(['watchlists']);
    return results.length ? results[0] : []; // empty lists
  },

  async createWatchlist(watchlist) {
    let toStore = {
      ...watchlist,
      id: createId(),
      createdAt: Date.now()
    }

    let watchlists = [
      ... (await this.loadWatchlists()),
      toStore
    ];

    await setValues({watchlists});
    return watchlists;
  },

  async deleteWatchlist(id) {
    let currentLists = await this.loadWatchlists();
    let watchlists = currentLists.filter( l => l.id !== id );

    await setValues({watchlists});
    await deleteValues([`wl:${id}`]);

    return watchlists;
  },

  async loadWatchlistPairs(id) {
    let results = await getValues([`wl:${id}`]);
    return results.length ? results[0] : [];
  },

  async addPairToWatchlist( watchlistId, pair ) {
    let pairs = await this.loadWatchlistPairs(watchlistId);

    // check if the pair is already there
    for( let p in pairs ){
      if( areEquals( p, pair )){
        // It is there, return the current list
        return pairs;
      }
    }

    let updatedList = [
      ...pairs,
      pair
    ]

    await setValues({
      [`wl:${watchlistId}`]: updatedList
    });
    return updatedList;
  },

  async removePairFromWatchlist( watchlistId, pair ) {
    let pairs = await this.loadWatchlistPairs( watchlistId );
    let updatedPairs = pairs.filter( p => !areEquals(p, pair) );

    await setValues({
      [`wl:${pair}`]: updatedPairs
    });

    return updatedPairs;
  }
}


function createId() {
  // If we want to do this right probably we would use
  // some standard like uuid
  return (Math.random()*10000000).toString();
}


// Let's promisify the storage API
function getValues( keys ){
  return new Promise( (resolve) => {
    chrome.storage.local.get( keys, resolve );
  })
}

function setValues( map ){
  return new Promise( (resolve) => {
    chrome.storage.local.set( map, resolve );
  })
}

function deleteValues( keys ){
  return new Promise( (resolve) => {
    chrome.storage.local.remove( keys, resolve );
  })
}