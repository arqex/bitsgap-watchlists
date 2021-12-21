import { html, Component } from "../../../vendor/preact.js";
import { Button } from "../../button/Button.js";
import { ExchangeImage } from "../../exchangeImage/ExchangeImage.js";
import {socketFeed, refreshPrice, refreshPrice1dAgo} from '../../../data/socketFeed.js';

export class PairItem extends Component {
  render() {
    const {item} = this.props;
    const classes = mergeClasses(
      'pairItem',
      this.props.watchlistId !== 'favourites' && 'withFavouritesControl'
    )
  
    return html`
      <div class=${classes} onClick=${ this._onSelected }>
        <div class="pairItemSymbol">
          ${ this.renderFavControls() }
          <span class="pairItemExchange">
            <${ExchangeImage} exchange=${item.exchange} />
          </span>
          <span class="pairItemName">
            ${item.symbol.replace('_', '/')}
          </span>
        </div>
        ${ this.renderPrice() }
        <div class="pairItemControls">
          <${Button} type="transparent" onClick=${this._onRemove}>
            <i class="fas fa-times"></i>
          <//>
        </div>
      </div>
    `
  }

  renderFavControls() {
    if( this.props.watchlistId === 'favourites' ) return;
    const starClasses = this.props.isFavourite ?
      "fas fa-star active" :
      "far fa-star inactive"
    ;

    return html`
      <div class="pairItemFavourite" onClick=${ this._onFavouriteToggle }>
        <i class=${starClasses}></i>
      </div>
    `
  }

  renderPrice() {
    const currentPrice = this.getCurrentPrice();
    const previousPrice = this.getPreviousPrice();
    let change = '';
    let color = '';
    if( currentPrice && previousPrice ){
      change = formatChange((currentPrice / previousPrice * 100) - 100);
      color = change > 0 ? 'green' : 'red';
      if( change > 0 ){
        color = 'green';
        change = `+${change}`;
      }
    }

    if( !change ) return;

    const classes = mergeClasses(
      'pairItemPriceWrapper',
      color
    )

    return html`
      <div class=${classes}>
        <div class="pairItemPrice">${currentPrice}</div>
        <div class="pairItemChange">
          <span class="pairItem24h">24h: </span>
          ${change}%
        </div>
      </div>
    `
  }

  _onSelected = () => {
    this.props.onSelected( this.props.item );
  }

  _onRemove = () => {
    this.props.onRemove( this.props.watchlistId, this.props.item );
  }

  getCurrentPrice() {
    const {exchange, symbol} = this.props.item;
    return socketFeed.getValue(`price:${exchange}:${symbol}`);
  }
 
  getPreviousPrice() {
    const {exchange, symbol} = this.props.item;
    return socketFeed.getValue(`1dAgo:${exchange}:${symbol}`);
  }

  componentDidMount() {
    const {exchange, symbol} = this.props.item;
    socketFeed.subscribe(`price:${exchange}:${symbol}`, this._refresh );
    socketFeed.subscribe(`1dAgo:${exchange}:${symbol}`, this._refresh );

    this.checkPriceAvailability(exchange, symbol);
  }

  componentWillUnmount() {
    const {exchange, symbol} = this.props.item;
    socketFeed.unsubscribe(`price:${exchange}:${symbol}`, this._refresh );
    socketFeed.unsubscribe(`1dAgo:${exchange}:${symbol}`, this._refresh );
  }

  _refresh = () => {
    this.forceUpdate();
  }

  checkPriceAvailability(exchange, symbol) {
    const price = this.getCurrentPrice();
    const prevPrice = this.getPreviousPrice();
    if( !price ){
      refreshPrice( exchange, symbol );
    }

    if( !prevPrice ){
      refreshPrice1dAgo( exchange, symbol );
    }

    if( !price || !prevPrice ){
      setTimeout( () => this.checkPriceAvailability(exchange, symbol), 1000 );
    }
  }

  _onFavouriteToggle = (e) => {
    console.log('Toggling favourite');
    e.preventDefault();

    const {isFavourite, item} = this.props;
    if( isFavourite ){
      this.props.onRemove('favourites', item)
    }
    else {
      this.props.onAdd('favourites', item);
    }
  }
}


function mergeClasses( ...args ){
  return args.filter(Boolean).join(' ');
}

function formatChange( n ) {
  return Math.round(n * 100) / 100;
}