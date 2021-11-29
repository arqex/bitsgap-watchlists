import { Component, html } from "../../vendor/preact.js";
import { ConfirmationModal } from "../modal/ConfirmartionModal.js";

export class CreateWatchlistModal extends Component {
  state = {
    name: ''
  }

  render() {
    const {onCancel, open} = this.props;
    return html`
      <${ConfirmationModal}
        open=${open}
        title="Create new watchlist"
        confirmText="Create"
        onCancel=${onCancel}
        onConfirm=${this._onCreate}>
        <div>
          <label for="watchlistName">Enter a name for your watchlist:</label>
          <input
            name="watchlistName"
            type="text"
            value=${this.state.name}
            onChange=${this._onNameChange} />
        </div>
      <//>
    `
  }

  _onNameChange = name => {
    this.setState({name});
  }

  _onCreate = () => {
    if( !this.state.name.trim() ) return;
    this.props.onCreate(this.state.name);
  }
}