import { addPairToWatchlist, createWatchlist, deleteWatchlist, removePairFromWatchlist } from "../../data/actions.js";
import { loadWatchlists } from "../../data/loaders.js";
import { html, Component } from "../../vendor/preact.js";
import { PairSelectorModal } from "../pairSelector/PairSelectorModal.js";
import { WatchlistBody } from "./body/WatchlistBody.js";
import { WatchlistHeader } from "./header/WatchlistHeader.js";

export class WatchlistPanel extends Component {
  state = {
    selectedWatchlistId: null,
    selectedPair: null,
    modalOpen: false,
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
          onAddPair=${ this._openModal }
          onRemoveList=${ this._onRemoveList } />
        <${WatchlistBody}
          selectedWatchlistId=${selected?.id}
          onCreateWatchlist=${ this._onCreateWatchlist }
          onSelectedPair=${ this._onSelectPair }
          onDeletePair=${ this._onDeletePair }
          onAddPair=${ this._openModal } />
        <${PairSelectorModal}
          open=${ this.state.modalOpen }
          onClose=${ this._closeModal }
          onSelected=${ this._onAddPair } />
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

  _onRemoveList = async (watchlistId) => {
    return await deleteWatchlist(watchlistId);
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

  _openModal = () => {
    this.setState({modalOpen: true});
  }

  _closeModal = () => {
    this.setState({modalOpen: false});
  }

  componentDidUpdate() {
    this.checkSelectedMarket();
  }

  checkSelectedMarket() {
    if( !this.state.selectedWatchlistId ){
      const {watchlists} = loadWatchlists();
      if( watchlists?.length > 0 ) {
        const selected = this.getSelected( watchlists );
        this.setState({selectedWatchlistId: selected?.id});
      }
    }
  }
}