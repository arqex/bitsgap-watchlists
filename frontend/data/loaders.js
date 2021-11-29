import { apiClient } from "./apiClient.js";
import { onListPairsLoaded, onWatchlistsLoaded } from "./reducers.js";
import { store } from "./store.js";

let loadWatchlistPromise = null;
export function loadWatchlists(){
  // If the data is in the store, return it
  let watchlists = store.watchlists;
  if( watchlists ){
    return {isLoading: false, watchlists};
  }

  // Otherwise, load it if needed
  if( !loadWatchlistPromise ){
    loadWatchlistPromise = apiClient.loadWatchlists()
      .then( watchlists => {
        loadWatchlistPromise = undefined;
        onWatchlistsLoaded(watchlists); 
      });
  }

  // And return we are loading
  return {isLoading: true, watchlists: null};
}

let loadPairsPromise = null;
export function loadWatchlistPairs( watchlistId ){
  let pairs = store.listPairs[watchlistId];
  if( pairs ){
    return {isLoading: false, pairs}
  }

  if( !loadPairsPromise ){
    loadPairsPromise = apiClient.loadWatchlistPairs(watchlistId)
      .then( pairs => {
        loadPairsPromise = null;
        onListPairsLoaded(watchlistId, pairs);
      });
  }

  return {isLoading: true, pairs: null};
}