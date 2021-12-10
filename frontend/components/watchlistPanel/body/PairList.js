import { loadWatchlistPairs } from "../../../data/loaders.js";
import { Component, html } from "../../../vendor/preact.js";
import { EmptyWatchlist } from "./EmptyWatchlist.js";
import { PairItem } from "./PairItem.js";

export class PairList extends Component {
  render() {
    const {watchlistId} = this.props;
    
    let {isLoading, pairs} = loadWatchlistPairs(watchlistId);
    if( isLoading ) return this.renderLoading();
    if( !pairs.length ) return this.renderEmpty();

    return html`
      <div class="watchlists-body pairList">
        ${ pairs.map( this._renderPair ) } 
      </div>
    `
  }

  _renderPair = pair => {
    return html`
      <${PairItem}
        key=${`${pair.exchange}${pair.symbol}`}
        item=${pair}
        onRemove=${this.props.onRemovePair}
        onSelected=${this.props.onSelectPair} />
    `
  }

  renderLoading() {
    return html`<div className="pairList">Loading...</div>`;
  }

  renderEmpty() {
    return html`
      <${EmptyWatchlist}
        onAddPair=${this.props.onAddPair} />
    `
  }
}