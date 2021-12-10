import { html, Component } from "../../../vendor/preact.js"
import { Button } from "../../button/Button.js";
import { WatchlistSelector } from "./WatchlistSelector.js";

export class WatchlistHeader extends Component {
  render () {
    return html`
      <div class="order-book-page__header">
        ${this.renderContent()}
      </div>
    `;
  }

  renderContent() {
    const {watchlists} = this.props;
    if( !watchlists.length ){
      return this.renderNoWatchlists();
    }

    const {onCreate, onSelected, onRemoveList, selected, onAddPair} = this.props;
    return html`
      <div class="watchlist-header">
        <div class="watchlist-selector">
          <${WatchlistSelector}
            selected=${selected}
            watchlists=${ watchlists }
            onCreate=${ onCreate }
            onSelect=${ onSelected }
            onRemove=${ onRemoveList } />
        </div>
        <div class="watchilist-add-pair">
          <${Button} type="transparent" onClick=${ onAddPair }>
          <i class="fas fa-plus"></i>
          <//>
        </div>
      </div>

    `
  }

  renderNoWatchlists(){
    return html`
      <div class="order-book-page__title">
        Watch lists
      </div>
    `
  }
}