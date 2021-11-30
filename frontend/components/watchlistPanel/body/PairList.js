import { loadWatchlistPairs } from "../../../data/loaders.js";
import { Component, html } from "../../../vendor/preact.js";
import { EmptyWatchlist } from "./EmptyWatchlist.js";

export class PairList extends Component {
  render() {
    const {watchlistId} = this.props;
    
    let {isLoading, pairs} = loadWatchlistPairs(watchlistId);
    if( isLoading ) return this.renderLoading();
    if( !pairs.length ) return this.renderEmpty();

    return html`
      <div class="watchlists-body">
        ${ pairs.map( this._renderPair ) } 
      </div>
    `
  }

  _renderPair = pair => {
    return html`
      <div key=${pair.symbol}>
        ${pair.exchange}: ${pair.symbol}
      </div>
    `
  }

  renderLoading() {
    return html`<div>Loading...</div>`;
  }

  renderEmpty() {
    return html`
      <${EmptyWatchlist}
        onAddPair=${this.props.onAddPair} />
    `
  }
}