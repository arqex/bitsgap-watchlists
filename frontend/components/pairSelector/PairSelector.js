import { refreshMarketPairs, socketFeed } from "../../data/socketFeed.js";
import { Component, html, createRef } from "../../vendor/preact.js";
import Fuse from "../../vendor/fuse.js";
import { PairSelectorItem } from "./PairSelectorItem.js";

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

    return html`
      <div class="pairSelector">
        <div class="inputWrapper">
          <i class="fas fa-search"></i>
          <input
            ref=${this.input}
            placeholder="Search"
            value=${query}
            onInput=${this._onSearchChange}
            onKeyDown=${this._onKeyDown} />
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
        onSelected=${this.props.onSelected}
        onRemoved=${this._onPairRemoved} />
    `
  }

  _onPairSelected = pair => {
    console.log('Selected', pair);
  }

  _onPairRemoved = pair => {
    console.log('Removed', pair);
  }

  componentDidMount() {
    if( !this.fuse ){
      refreshMarketPairs();
    }
    socketFeed.subscribe('allPairs', this._onPairsUpdated );

    this.input?.current?.focus();
  }

  componentWillUnmount() {
    socketFeed.unsubscribe('allPairs', this._onPairsUpdated );
  }

  _onPairsUpdated = () => {
    this.setState({
      fuse: this.createIndex()
    });
  }

  createIndex() {
    const pairsByExchange = socketFeed.getValue('allPairs');
    if( !pairsByExchange ) return;

    let entries = [];
    for( let exchange in pairsByExchange ){
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

    const options = {
      keys: [
        {name: 'queryStr'}
      ],
      threshold: 0.6
    }
    
    return new Fuse(entries, options);
  }

  _onKeyDown = e => {
    console.log(e);
    if( e.key === 'ArrowDown' ){
      e.preventDefault();
      let results = this.getResults();
      let current = this.state.highlightedIndex;
      this.setState({
        highlightedIndex: current === results.length - 1 ? 0 : current + 1
      });
    }
    else if( e.key === 'ArrowUp' ){
      e.preventDefault();
      let results = this.getResults();
      let current = this.state.highlightedIndex;
      this.setState({
        highlightedIndex: current === 0 ? results.length - 1 : current - 1
      });
    }
    else if( e.key === 'Enter' ){
      e.preventDefault();
      let results = this.getResults();
      this.props.onSelected( results[this.highlightedIndex] );
    }
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