import { addPairToWatchlist, createWatchlist } from "../../data/actions.js";
import { loadWatchlists } from "../../data/loaders.js";
import { html, Component } from "../../vendor/preact.js";
import { ScopedStylesDiv } from "../scopedStylesDiv/ScopedStylesDiv.js";
import { WatchlistBody } from "./WatchlistBody.js";
import { WatchlistHeader } from "./WatchlistHeader.js";
import styles from './watchlists.css' assert {type: 'css'};

export class Watchlists extends Component {
  state = {
    selectedWatchlistId: null,
    selectedPair: null
  }

  render() {
    const {isLoading, watchlists} = loadWatchlists();
    if( isLoading ) return 'Loading...';

    const {selectedWatchlistId} = this.state;
    return html`
      <${ScopedStylesDiv} styles=${styles} class="trading-tables" style="width: 290px">
        <${WatchlistHeader}
          watchlists=${watchlists}
          selected=${ watchlists.find( wl => wl.id === selectedWatchlistId ) }
          onCreate=${ this._onCreateWatchlist }
          onSelected=${ this._onSelectWatchlist }
          onAddPair=${ this._onAddPair } />
        <${WatchlistBody}
          selectedWatchlistId=${selectedWatchlistId}
          onCreateWatchlist=${ this._onCreateWatchlist }
          onSelectedPair=${ this._onSelectPair }
          onDeletePair=${ this._onDeletePair } />
      </div>
    `
  }

  _onCreateWatchlist = async (name) => {
    let id = await createWatchlist(name);
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