import { loadWatchlistPairs } from "../../../data/loaders.js";
import memoizeOne from "../../../vendor/memoize-one.js";
import { Component, html } from "../../../vendor/preact.js";
import { Button } from "../../button/Button.js";
import { PairItem } from "./PairItem.js";

export class PairList extends Component {
  render() {
    const {watchlistId} = this.props;
    let items;
    if( watchlistId === 'favourites' ){
      items = this.props.favourites;
    }
    else {
      let {isLoading, pairs} = loadWatchlistPairs(watchlistId);
      if( isLoading ) return this.renderLoading();
      items = pairs;
    }

    if( !items.length ) return this.renderEmpty();
    
    return html`
      <div class="watchlists-body bge_pair_list">
        ${ items.map( this._renderPair ) } 
      </div>
    `
  }

  _renderPair = pair => {
    if( !pair ) return;

    const {watchlistId} = this.props;

    return html`
      <${PairItem}
        key=${getPairKey(pair)}
        watchlistId=${watchlistId}
        item=${pair}
        onAdd=${this.props.onAddPair}
        onRemove=${this.props.onRemovePair}
        onSelected=${this.props.onSelectPair}
        isFavourite=${ isFavourite(this.props.favourites, pair) } />
    `
  }

  renderLoading() {
    return html`<div className="pairList">Loading...</div>`;
  }

  renderEmpty() {
    return html`
      <div class="noWatchlistsBody">
        <div class="noWatchlistsMessage">
          No pairs in this watchlist yet.
        </div>
        <${Button} onClick=${ this.props.onOpenAddModal }>
          Add a pair
        <//>
      </div>
    `
  }
}

function isFavourite( favourites, pair ){
  const favouriteIndex = getFavouriteIndex(favourites);
  return favouriteIndex[getPairKey(pair)] === 1;
}


const getFavouriteIndex= memoizeOne( list => {
  const index = {};
  list.forEach( pair => {
    index[getPairKey(pair)] = 1
  });
  return index;
});


function getPairKey( pair ){
  return `${pair.exchange}:${pair.symbol}`;
}