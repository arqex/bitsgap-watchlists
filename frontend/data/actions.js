import { apiClient } from "./apiClient.js";
import { onListPairsLoaded, onWatchlistsLoaded } from "./reducers.js";

export async function createWatchlist(name) {
  let {id} = await apiClient.createWatchlist({name});
  let watchlists = await apiClient.loadWatchlists();
  onWatchlistsLoaded( watchlists );
  return {id};
}

export async function deleteWatchlist(id) {
  let watchlists = await apiClient.deleteWatchlist(id);
  onWatchlistsLoaded( watchlists );
}

export async function addPairToWatchlist( watchlistId, pair ) {
  let pairs = await apiClient.addPairToWatchlist( watchlistId, pair );
  onListPairsLoaded( watchlistId, pairs );
}

export async function removePairFromWatchlist( watchlistId, pair ){
  let pairs = await apiClient.removePairFromWatchlist( watchlistId, pair );
  onListPairsLoaded( watchlistId, pairs );
}