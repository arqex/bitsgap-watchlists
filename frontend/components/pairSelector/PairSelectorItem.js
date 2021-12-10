import { html, Component } from "../../vendor/preact.js";
import { ExchangeImage } from "../exchangeImage/ExchangeImage.js";

export class PairSelectorItem extends Component {
  render() {
    const {item} = this.props;

    return html`
      <div class="item" onClick=${this._onSelect}>
        <div class="itemSymbol">${item.tag}</div>
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
    this.props.onSelected(this.props.item);
  }

  _onRemove = () => {
    this.props.onRemoved(this.props.item);
  }
}