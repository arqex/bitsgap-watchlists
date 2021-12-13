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
    const {onAddPair, onDeletePair, onSelectedPair} = this.props;
    return html`
      <${PairList}
        onAddPair=${onAddPair}
        onRemovePair=${onDeletePair}
        onSelectPair=${onSelectedPair}
        watchlistId=${watchlistId} />
    `
  }
}