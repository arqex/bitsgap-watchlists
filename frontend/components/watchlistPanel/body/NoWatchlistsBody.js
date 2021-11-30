import { Component, html } from "../../../vendor/preact.js"
import { Button } from "../../button/Button.js";
import { CreateWatchlistModal } from "../CreateWatchlistModal.js";

export class NoWatchlistsBody extends Component {
  state = {
    modalOpen: false
  }

  render() {
    return html`
      <div class="no-watchlists-body">
        <div class="no-watchlist-message">
          Seems that you don't have any watchlists yet.
        </div>
        <${Button} onClick=${ this._openModal }>
          Create watchlist
        <//>
        <${CreateWatchlistModal}
          open=${this.state.modalOpen}
          onCancel=${ this._closeModal }
          onConfirm=${ this.props.onCreateWatchlist } />
      </div>
    `
  }

  _openModal = () => {
    this.setState({modalOpen: true});
  }

  _closeModal = () => {
    this.setState({modalOpen: false});
  }
}