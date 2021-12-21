import { ContainerTracker } from "../../bitsgapConnectors/containerTracker.js";
import { addPairToWatchlist, addToFavourites, createWatchlist, deleteWatchlist, removeFromFavourites, removePairFromWatchlist } from "../../data/actions.js";
import { getLastWatchlistId, saveLastWatchlistId } from "../../data/frontendStore.js";
import { loadFavourites, loadWatchlists } from "../../data/loaders.js";
import { refreshBalances, socketFeed } from "../../data/socketFeed.js";
import { getPairSelector } from "../../scripts/pairSelector.js";
import { html, Component } from "../../vendor/preact.js";
import { PairSelectorModal } from "../pairSelector/PairSelectorModal.js";
import { WatchlistBody } from "./body/WatchlistBody.js";
import { WatchlistHeader } from "./header/WatchlistHeader.js";

export class WatchlistPanel extends Component {
  state = {
    selectedPair: null,
    modalOpen: false,
    modalMode: 'add'
  }

  defaultDimensions = {
    top: 59,
    left: 5,
    width: 290,
    height: 1000
  }

  render() {
    const {isLoading: loadingWL , watchlists} = loadWatchlists();
    const {isLoading: loadingFav, favourites} = loadFavourites();
    if( loadingWL || loadingFav ) return 'Loading...';

    const selected = this.getSelected(watchlists, favourites);
    return html`
      <div class="trading-tables bge_watchlists" style=${this.getDimensions()}>
        <${WatchlistHeader}
          watchlists=${watchlists}
          selected=${ selected }
          onCreate=${ this._onCreateWatchlist }
          onSelected=${ this._onSwitchWatchlist }
          onAddPair=${ this._openAddModal }
          onRemoveList=${ this._onRemoveList } />
        <${WatchlistBody}
          selectedWatchlistId=${selected?.id}
          onCreateWatchlist=${ this._onCreateWatchlist }
          onSelectedPair=${ this._onSwitchPair }
          onDeletePair=${ this._onDeletePair }
          onAddPair=${ this._onAddPair }
          onOpenAddModal=${ this._openAddModal }
          onRemoveList=${ this._onRemoveList }
          favourites=${favourites} />
        <${PairSelectorModal}
          connectedExchanges=${ this.getConnectedExchanges() }
          open=${ this.state.modalOpen }
          mode=${ this.state.modalMode }
          onClose=${ this._closeModal }
          onSelected=${ this._onSelectPair } />
      </div>
    `
  }

  getSelected( watchlists, favourites ) {
    if( watchlists.length === 0 ) return;
    const selectedWatchlistId = getLastWatchlistId();
    if( selectedWatchlistId === 'favourites' ){
      return {id: 'favourites', pairs: favourites, name: 'Favourites'};
    }
    return watchlists.find( wl => wl.id === selectedWatchlistId ) || watchlists[0];
  }

  getSelectedWatchlistId() {
    const {watchlists} = loadWatchlists();
    let selected = this.getSelected(watchlists);
    return selected?.id;
  }

  connectedExchanges = false
  getConnectedExchanges() {
    if( this.connectedExchanges ){
      return this.connectedExchanges;
    }

    const balances = socketFeed.getValue('balances');
    if( balances ){
      const exchanges = [];
      Object.keys(balances).forEach( exchangeKey => {
        if( balances[exchangeKey].uts ){
          exchanges.push(exchangeKey);
        }
      })
      this.connectedExchanges = exchanges;
      return exchanges;
    }

    return [];
  }

  _onCreateWatchlist = async (name) => {
    let {id} = await createWatchlist(name);
    this._onSwitchWatchlist(id);
  }

  _onSwitchWatchlist = (selectedWatchlistId) => {
    saveLastWatchlistId(selectedWatchlistId);
  }

  _onRemoveList = async (watchlistId) => {
    return await deleteWatchlist(watchlistId);
  }

  _onSelectPair =(pair) => {
    if( this.state.modalMode === 'add' ){
      this._onAddPair(this.getSelectedWatchlistId(), pair);
    }
    else {
      this._closeModal();
      this._onSwitchPair(pair);
    }
  }

  _onAddPair = (watchlistId, item) => {
    const pair = {
      exchange: item.exchange,
      symbol: item.symbol
    }
    console.log('Adding pair', watchlistId, pair);
    if( watchlistId === 'favourites' ){
      addToFavourites(pair);
    }
    else {
      addPairToWatchlist(watchlistId, pair);
    }
  }

  _onSwitchPair = (pairData) => {
    let pairSelector = getPairSelector();
    pairSelector(pairData.symbol, pairData.exchange);
    this.setState(pairData);
  }

  _onDeletePair = (watchlistId, pair) => {
    if( watchlistId === 'favourites' ){
      removeFromFavourites(pair);
    }
    else {
      removePairFromWatchlist(watchlistId, pair);
    }
  }

  _openAddModal = () => {
    this.setState({
      modalOpen: true,
      modalMode: 'add'
    });
  }

  _openSearchModal = () => {
    this.setState({
      modalOpen: true,
      modalMode: 'search'
    });
  }

  _closeModal = () => {
    this.setState({modalOpen: false});
  }

  componentDidMount(){
    document.body.addEventListener('keydown', this._onTyping );
    socketFeed.subscribe('balances', this._refresh);
    refreshBalances();
    this.trackContainer();
  }

  componentWillUnmount() {
    socketFeed.unsubscribe('balances', this._refresh);
    document.body.removeEventListener('keydown', this._onTyping );
    if( this.tracker ){
      this.tracker.removeChangeListener( this._refresh );
      this.observer.disconnect();
    }
  }
  
  _onTyping = (e) => {
    if( e.target.tagName === 'INPUT' || this.state.modalOpen ) return;
    if( e.metaKey || e.altKey || e.ctrlKey ) return;
    if( e.key.match(/^[a-zA-Z0-9]$/) ){
      this.openQuickSearch();
    }
  }

  _refresh = () => {
    this.forceUpdate();
  }

  openQuickSearch() {
    this._openSearchModal();
  }

  tracker = null
  trackContainer() {
    this.tracker = new ContainerTracker('.trading-page__column_position_left');
    this.setState({dimensions: this.tracker.getDimensions() });
    this.tracker.addChangeListener( this._refresh );
  }

  observe = null
  trackLayout() {
    this.observer = new MutationObserver( this._refresh );
    this.observer.observe(document.querySelector('.trading-page'), {attributes: true});
  }

  getDimensions() {
    return this.tracker?.getDimensions() || this.defaultDimensions;
  }
}