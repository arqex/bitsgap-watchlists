import { refreshMarketPairs, socketFeed } from "../../data/socketFeed.js";
import { Component, html } from "../../vendor/preact.js";
import Fuse from "../../vendor/fuse.js";
import { PairSelectorItem } from "./PairSelectorItem.js";

export class PairSelector extends Component {
  state = {
    fuse: this.createIndex(),
    query: ''
  }

  render() {
    const {fuse, query} = this.state;

    if( !fuse ){
      return html`<div class="pairSelector">Loading...</div>`;
    }

    let results = query ?
      fuse.search(query).slice(0,20) :
      defaultResults
    ;

    return html`
      <div class="pairSelector">
        <div class="inputWrapper">
          <i class="fas fa-search"></i>
          <input
            placeholder="Search"
            value=${query}
            onInput=${this._onSearchChange} />
        </div>
        <div class="resultsWrapper">
          <div class="results">
            ${ results.map( this._renderItem ) }
          </div>
        </div>
      </div>
    `;
  }

  _onSearchChange = e => {
    this.setState({query: e.target.value.toUpperCase() });
  }

  _renderItem = ({item}) => {
    return html`
      <${PairSelectorItem}
        key=${item.exchange + item.tag}
        item=${item}
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
      pairsByExchange[exchange].forEach( pair => {
        entries.push({
          exchange,
          pair,
          tag: pair.replace('_', '').replace(/\(.*?\)/, '')
        })
      })
    }

    const options = {
      keys: [
        {name: 'exchange', weight: 1},
        {name: 'tag', weight: 2},
      ],
      threshold: 0.2
    }
    
    return new Fuse(entries, options);
  }
}


const defaultResults = [
  {item: {exchange: 'bitfinex', pair: 'BTC_USDT', tag: 'BTCUSDT'} },
  {item: {exchange: 'kucoin', pair: 'ETH_USDT', tag: 'ETHUSDT'} },
  {item: {exchange: 'binance', pair: 'BNB_USDT', tag: 'ADAUSDT'} },
  {item: {exchange: 'kucoin', pair: 'DOT_BTC', tag: 'DOTBTC'} },
  {item: {exchange: 'bittrex', pair: 'ADA_USDT', tag: 'ADAUSDT'} },
  {item: {exchange: 'hitbtc', pair: 'DOT_BTC', tag: 'DOTBTC'} },
  {item: {exchange: 'ftx', pair: 'SOL_BTC', tag: 'SOLBTC'} },
  {item: {exchange: 'huobi', pair: 'XRP_BTC', tag: 'XRPBTC'} },
  {item: {exchange: 'coinbase pro', pair: 'LTC_BTC', tag: 'LTCBTC'} },
  {item: {exchange: 'poloniex', pair: 'AVA_BTC', tag: 'AVABTC'} },
  {item: {exchange: 'gemini', pair: 'LUNA_BTC', tag: 'LUNABTC'} }
]