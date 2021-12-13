import { addPairToWatchlist, createWatchlist, deleteWatchlist, removePairFromWatchlist } from "../../data/actions.js";
import { getLastWatchlistId, saveLastWatchlistId } from "../../data/frontendStore.js";
import { loadWatchlists } from "../../data/loaders.js";
import { html, Component } from "../../vendor/preact.js";
import { PairSelectorModal } from "../pairSelector/PairSelectorModal.js";
import { WatchlistBody } from "./body/WatchlistBody.js";
import { WatchlistHeader } from "./header/WatchlistHeader.js";

export class WatchlistPanel extends Component {
  state = {
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
    const selectedWatchlistId = getLastWatchlistId();
    return watchlists.find( wl => wl.id === selectedWatchlistId ) || watchlists[0];
  }

  getSelectedWatchlistId() {
    const {watchlists} = loadWatchlists();
    let selected = this.getSelected(watchlists);
    return selected?.id;
  }

  _onCreateWatchlist = async (name) => {
    let {id} = await createWatchlist(name);
    this._onSelectWatchlist(id);
  }

  _onSelectWatchlist = (selectedWatchlistId) => {
    saveLastWatchlistId(selectedWatchlistId);
  }

  _onRemoveList = async (watchlistId) => {
    return await deleteWatchlist(watchlistId);
  }

  _onAddPair = async (pair) => {
    await addPairToWatchlist(this.getSelectedWatchlistId(), pair);
    this._onSelectPair(pair);
  }

  _onSelectPair = (selectedPair) => {
    this.setState(selectedPair);
  }

  _onDeletePair = (pair) => {
    removePairFromWatchlist(this.getSelectedWatchlistId(), pair);
  }

  _openModal = () => {
    this.setState({modalOpen: true});
  }

  _closeModal = () => {
    this.setState({modalOpen: false});
  }

  componentDidMount(){
    document.body.addEventListener('keydown', this._onTyping );
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this._onTyping );
  }
  
  _onTyping = (e) => {
    if( e.target.tagName === 'INPUT' || this.state.modalOpen ) return;

    if( e.key.match(/^[a-zA-Z0-9]$/) ){
      this.openQuickSearch();
    }
  }

  openQuickSearch() {
    console.log('Opening quick search');
  }
}