import { html, Component } from "../../../vendor/preact.js";
import { Button } from "../../button/Button.js";

export class EmptyWatchlist extends Component {
  state = {
    modalOpen: false
  }
  render() {
    return html`
      <div class="no-watchlists-body">
        <div class="no-watchlist-message">
          No pairs in this watchlist yet.
        </div>
        <${Button} onClick=${ this._openModal }>
          Add a pair
        <//>
      </div>
    `
  }
}