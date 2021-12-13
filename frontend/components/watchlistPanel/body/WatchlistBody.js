import { getPairSelector } from "../../../scripts/pairSelector.js";
import { deleteWatchlist } from "../../../data/actions.js";
import { html, Component } from "../../../vendor/preact.js";
import { NoWatchlistsBody } from "./NoWatchlistsBody.js";
import { PairList } from "./PairList.js";

export class WatchlistBody extends Component {
  render(){
    return html`
      <div class="order-book-page__content">
        ${this.renderContent() }
      </div>
    `
  }

  renderContent() {
    const {selectedWatchlistId} = this.props;
    if( !selectedWatchlistId ){
      return this.renderNoWatchlists();
    }
    return this.renderWatchlist(selectedWatchlistId);
  }

  renderNoWatchlists() {
    return html`
      <${NoWatchlistsBody}
        onCreateWatchlist=${this.props.onCreateWatchlist} />
    `
  }

  renderWatchlist( watchlistId ) {
    console.log(typeof this.props.onAddPair);
    return html`
      <${PairList}
        onAddPair=${this.props.onAddPair}
        onRemovePair=${this._onRemovePair}
        onSelectPair=${this._onSelectPair}
        watchlistId=${watchlistId} />
    `
  }

  _onRemovePair = (pairData) => {
    this.props.onDeletePair(pairData);
  }

  _onSelectPair = (pairData) => {
    let pairSelector = getPairSelector();
    pairSelector(pairData.symbol, pairData.exchange);
  }
}