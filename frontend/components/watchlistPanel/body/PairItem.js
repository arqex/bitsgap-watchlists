import { html, Component } from "../../../vendor/preact.js";
import { Button } from "../../button/Button.js";
import { ExchangeImage } from "../../exchangeImage/ExchangeImage.js";

export class PairItem extends Component {
  render() {
    const {item, onRemove} = this.props;
  
    return html`
      <div class="pairItem" onClick=${ this._onSelected }>
        <div class="pairItemSymbol">
          <span class="pairItemExchange">
            <${ExchangeImage} exchange=${item.exchange} />
          </span>
          <span class="pairItemName">
            ${item.symbol}
          </span>
        </div>
        <div class="pairItemControls">
          <${Button} type="transparent" onClick=${this._onRemove}>
            <i class="fas fa-times"></i>
          <//>
        </div>
      </div>
    `
  }

  _onSelected = () => {
    this.props.onSelected( this.props.item );
  }

  _onRemove = () => {
    this.props.onRemove( this.props.item );
  }
}