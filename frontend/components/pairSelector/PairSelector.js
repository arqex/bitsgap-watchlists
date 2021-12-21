import { refreshMarketPairs, socketFeed } from "../../data/socketFeed.js";
import { Component, html, createRef } from "../../vendor/preact.js";
import Fuse from "../../vendor/fuse.js";
import { PairSelectorItem } from "./PairSelectorItem.js";
import { getLastExchangeInSelector, saveLastExchangeInSelector } from "../../data/frontendStore.js";
import { ExchangeFilters } from "./ExchangeFilters.js";

export class PairSelector extends Component {
  state = {
    fuse: this.createIndex(),
    query: '',
    highlightedIndex: 0
  }

  input = createRef()

  render() {
    const {fuse, query} = this.state;

    if( !fuse ){
      return html`<div class="pairSelector">Loading...</div>`;
    }

    const {connectedExchanges} = this.props;

    return html`
      <div class="bge_pair_selector">
        <div class="inputWrapper">
          <i class="fas fa-search"></i>
          <input
            ref=${this.input}
            placeholder="Search"
            value=${query}
            onInput=${this._onSearchChange}
            onKeyDown=${this._onKeyDown} />
        </div>
        <div class="exchangeFilterWrapper">
          <${ExchangeFilters}
            exchanges=${Object.keys(socketFeed.getValue('allPairs'))}
            connected=${connectedExchanges}
            selected=${this.getSelectedExchanges()}
            onSelect=${this._onFilterExchanges } />
        </div>
        <div class="resultsWrapper">
          <div class="results">
            ${ this.getResults().map( this._renderItem ) }
          </div>
        </div>
      </div>
    `;
  }

  getResults() {
    const {query} = this.state;

    return query ?
      this.state.fuse.search( query ).slice(0,20) :
      defaultResults
    ;
  }

  _onSearchChange = e => {
    this.setState({
      query: e.target.value.toUpperCase(),
      highlightedIndex: 0
    });
  }

  _renderItem = ({item}, i) => {
    return html`
      <${PairSelectorItem}
        key=${item.exchange + item.tag}
        item=${item}
        isHighlighted=${this.state.highlightedIndex === i}
        mode=${this.props.mode}
        onSelected=${this._onSelected} />
    `
  }

  componentDidMount() {
    if( !this.fuse ){
      refreshMarketPairs();
    }
    socketFeed.subscribe('allPairs', this._updateIndex );

    this.input?.current?.focus();
  }

  lastFilter = getLastExchangeInSelector()
  componentDidUpdate() {
    const filter = getLastExchangeInSelector()
    if( this.lastFilter !== filter ){
      this.lastFilter = filter;
      this._updateIndex();
    }
  }

  componentWillUnmount() {
    socketFeed.unsubscribe('allPairs', this._updateIndex );
  }

  _updateIndex = () => {
    this.setState({
      fuse: this.createIndex()
    });
  }

  createIndex() {
    const pairsByExchange = socketFeed.getValue('allPairs');
    if( !pairsByExchange ) return;

    const isSelected = this.getExchangeFilter();

    let entries = [];
    for( let exchange in pairsByExchange ){
      if( isSelected(exchange) ){
        pairsByExchange[exchange].forEach( symbol => {
          let tag = symbol.replace('_', '').replace(/\(.*?\)/, '');
          entries.push({
            exchange,
            symbol,
            tag,
            queryStr: `${tag} ${symbol.replace('_', ' ')} ${exchange}`
          })
        })
      }
    }

    const options = {
      keys: [
        {name: 'queryStr'}
      ],
      threshold: 0.2,
      useExtendedSearch: true
    }
    
    return new Fuse(entries, options);
  }

  getExchangeFilter() {
    const selectedExchanges = this.getSelectedExchanges();
    if( selectedExchanges === 'all' ) return () => true;

    if( selectedExchanges === 'connected' ){
      const {connectedExchanges} = this.props;
      return exchange => connectedExchanges.includes(exchange);
    }

    return (exchange) => selectedExchanges === exchange;
  }

  getSelectedExchanges() {
    return getLastExchangeInSelector() ||
      this.props.connectedExchanges && 'connected' ||
      'all'
    ;
  }

  _onSelected = item => {
    this.props.onSelected(item);
    // Seems that we need to wait for focusing the input
    setTimeout(() => {
      this.input?.current?.focus();
      this.input?.current?.select();
    }, 200);
  }

  _onKeyDown = (event) => {
    const {key} = event;
    if( key === 'ArrowDown' ){
      event.preventDefault();
      let results = this.getResults();
      let current = this.state.highlightedIndex;
      this.setState({
        highlightedIndex: current === results.length - 1 ? 0 : current + 1
      });
    }
    else if( key === 'ArrowUp' ){
      event.preventDefault();
      let results = this.getResults();
      let current = this.state.highlightedIndex;
      this.setState({
        highlightedIndex: current === 0 ? results.length - 1 : current - 1
      });
    }
    else if( key === 'Enter' ){
      event.preventDefault();
      let results = this.getResults();
      let selected = results[this.state.highlightedIndex ];
      if( selected ){
        this._onSelected(selected.item);
      }
    }
  }

  _onFilterExchanges = filter => {
    saveLastExchangeInSelector(filter);
  }
}

const defaultResults = [
  {item: {exchange: 'bitfinex', symbol: 'BTC_USDT', tag: 'BTCUSDT'} },
  {item: {exchange: 'kucoin', symbol: 'ETH_USDT', tag: 'ETHUSDT'} },
  {item: {exchange: 'binance', symbol: 'BNB_USDT', tag: 'ADAUSDT'} },
  {item: {exchange: 'kucoin', symbol: 'DOT_BTC', tag: 'DOTBTC'} },
  {item: {exchange: 'bittrex', symbol: 'ADA_USDT', tag: 'ADAUSDT'} },
  {item: {exchange: 'hitbtc', symbol: 'DOT_BTC', tag: 'DOTBTC'} },
  {item: {exchange: 'ftx', symbol: 'SOL_BTC', tag: 'SOLBTC'} },
  {item: {exchange: 'huobi', symbol: 'XRP_BTC', tag: 'XRPBTC'} },
  {item: {exchange: 'coinbase pro', symbol: 'LTC_BTC', tag: 'LTCBTC'} },
  {item: {exchange: 'poloniex', symbol: 'AVA_BTC', tag: 'AVABTC'} },
  {item: {exchange: 'gemini', symbol: 'LUNA_USD', tag: 'LUNAUSD'} }
]