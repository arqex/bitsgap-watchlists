// Receive petitions from the frontend and reply using messages
window.addEventListener('message', async (msg) => {
  const data = msg?.data;
  if( data?.origin === 'bge:frontend' ){
    const {id, action, args} = data;
    if( actionHandlers[action] ){
      let result = await actionHandlers[action](args);
      window.postMessage({
        id,
        origin: 'bge:backend',
        result
      });
    }
  }
});

// THE HANDLERS
const actionHandlers = {
  async getWatchlists() {
    let results = (await getValues(['watchlists'])).watchlists;
    return results?.length ? results : []; // empty lists
  },

  async createWatchlist({watchlist}) {
    let toStore = {
      ...watchlist,
      id: createId(),
      createdAt: Date.now()
    }

    let watchlists = [
      ... (await this.getWatchlists()),
      toStore
    ];

    await setValues({watchlists});
    return {id: toStore.id};
  },

  async deleteWatchlist(id) {
    let currentLists = await this.getWatchlists();
    let watchlists = currentLists.filter( l => l.id !== id );

    await setValues({watchlists});
    await deleteValues([`wl:${id}`]);

    return watchlists;
  },

  async getWatchlistPairs(id) {
    let key = `wl:${id}`;
    let results = (await getValues([key]))[key];
    return results?.length ? results : [];
  },

  async addPairToWatchlist( {watchlistId, pair} ) {
    let pairs = await this.getWatchlistPairs(watchlistId);

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

  async removePairFromWatchlist( {watchlistId, pair} ) {
    let pairs = await this.getWatchlistPairs( watchlistId );
    let updatedPairs = pairs.filter( p => !areEquals(p, pair) );

    await setValues({
      [`wl:${watchlistId}`]: updatedPairs
    });

    return updatedPairs;
  },

  async getFavourites() {
    return (await getValues(['fav'])).fav || [];
  },

  async addToFavourites(pair) {
    let pairs = await this.getFavourites();

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
    await setValues({ fav: updatedList });
    return updatedList;
  },

  async removeFromFavourites(pair) {
    let pairs = await this.getFavourites();
    let updatedList = pairs.filter( p => !areEquals(p, pair) );
    await setValues({ fav: updatedList });
    return updatedList;
  }
}



// HELPERS to store and retrieve
function createId() {
  // If we want to do this right probably we would use
  // some standard like uuid
  return (Math.random()*10000000).toString();
}

// Let's promisify the storage API
function getValues( keys ){
  console.log('Getting value', keys);
  return new Promise( (resolve) => {
    chrome.storage.local.get( keys, resolve );
  })
}

function setValues( map ){
  console.log('Setting value', map);
  return new Promise( (resolve) => {
    chrome.storage.local.set( map, resolve );
  })
}

function deleteValues( keys ){
  return new Promise( (resolve) => {
    chrome.storage.local.remove( keys, resolve );
  })
}


function areEquals( pair1, pair2 ){
  return pair1.exchange === pair2.exchange && pair1.symbol === pair2.symbol;
}