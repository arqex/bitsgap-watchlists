import { html, Component } from "../../vendor/preact.js";
import { ExchangeImage } from "../exchangeImage/ExchangeImage.js";

export class PairSelectorItem extends Component {
  render() {
    const {item, isHighlighted} = this.props;

    const classes = mergeClasses(
      'item',
      isHighlighted && 'highlighted'
    );

    return html`
      <div class=${classes} onClick=${this._onSelect}>
        <div class="itemSymbol">${item.symbol}</div>
        <div class="itemExchange">
          <span class="itemExchangeName">${item.exchange}</span>
          <span class="itemExchangeImage">
            <${ExchangeImage} exchange=${item.exchange} />
          </span>
        </div>
      </div>
    `
  }
  _onSelect = () => {
    console.log(typeof this.props.onSelected);
    this.props.onSelected(this.props.item);
  }

  _onRemove = () => {
    this.props.onRemoved(this.props.item);
  }
}


function mergeClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}