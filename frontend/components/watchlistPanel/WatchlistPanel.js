import { addPairToWatchlist, createWatchlist } from "../../data/actions.js";
import { loadWatchlists } from "../../data/loaders.js";
import { html, Component } from "../../vendor/preact.js";
import { WatchlistBody } from "./body/WatchlistBody.js";
import { WatchlistHeader } from "./WatchlistHeader.js";

export class WatchlistPanel extends Component {
  state = {
    selectedWatchlistId: null,
    selectedPair: null
  }

  render() {
    const {isLoading, watchlists} = loadWatchlists();
    if( isLoading ) return 'Loading...';

    const selected = this.getSelected(watchlists);
    return html`
      <div class="trading-tables bge_watchlists" style="width: 290px">
        <${WatchlistHeader}
          watchlists=${watchlists}
          selected=${ selected }
          onCreate=${ this._onCreateWatchlist }
          onSelected=${ this._onSelectWatchlist }
          onAddPair=${ this._onAddPair } />
        <${WatchlistBody}
          selectedWatchlistId=${selected?.id}
          onCreateWatchlist=${ this._onCreateWatchlist }
          onSelectedPair=${ this._onSelectPair }
          onDeletePair=${ this._onDeletePair } />
      </div>
    `
  }

  getSelected( watchlists ) {
    if( watchlists.length === 0 ) return;
    const {selectedWatchlistId} = this.state;
    return watchlists.find( wl => wl.id === selectedWatchlistId ) || watchlists[0];
  }

  _onCreateWatchlist = async (name) => {
    let {id} = await createWatchlist(name);
    this._onSelectWatchlist(id);
  }

  _onSelectWatchlist = (selectedWatchlistId) => {
    this.setState({selectedWatchlistId});
  }

  _onAddPair = async (pair) => {
    await addPairToWatchlist(this.state.selectedWatchlistId, pair);
    this._onSelectPair(pair);
  }

  _onSelectPair = (selectedPair) => {
    this.setState(selectedPair);
  }

  _onDeletePair = (pair) => {
    removePairFromWatchlist(this.state.selectedWatchlistId, pair);
  }
}