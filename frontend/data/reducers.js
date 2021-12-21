import { store } from "./store.js";
import { emitChange } from "./storeChangeEmitter.js";


export function onWatchlistsLoaded(watchlists){
  store.watchlists = watchlists;
  emitChange();
}

export function onListPairsLoaded(watchlistId, pairs){
  store.listPairs = {
    ...(store.listPairs || {}),
    [watchlistId]: pairs
  };
  emitChange();
}

export function onFavouritesLoaded(pairs){
  store.favourites = pairs;
  emitChange();
}
