import { html, Component } from "../../vendor/preact.js";
import { Button } from "../button/Button.js";
import { InputGroup } from "../inputGroup/InputGroup.js";
import { ConfirmationModal } from "../modal/ConfirmartionModal.js";

export class WatchlistBody extends Component {
  state = {
    createWatchlistName: '',
    isCreatingWatchlist: false,
    error: false
  }
  
  render(){
    return html`
      <div class="order-book-page__content">
        ${this.renderContent() }
      </div>
    `
  }

  renderContent() {
    const {selectedWatchlistId} = this.props;
    if( !selectedWatchlistId ){
      return this.renderNoWatchlists();
    }
    this.renderWatchlist(selectedWatchlistId);
  }

  renderNoWatchlists() {
    const {isCreatingWatchlist, createWatchlistName, error} = this.state;

    console.log(isCreatingWatchlist);

    return html`
      <div class="no-watchlists-body">
        <div class="no-watchlist-message">
          Seems that you don't have any watchlists yet.
        </div>
        <${Button} onClick=${this._openCreateWatchlistModal}>
          Create watchlist
        <//>
        <${ConfirmationModal}
          title="Create watchlist"
          open=${isCreatingWatchlist}
          onCancel=${this._closeCreateWatchlistModal}
          onConfirm=${this._checkWatchlistCreation}>
          <${InputGroup}
            label="Enter a name for the watch list:"
            name="watchlistName"
            value=${createWatchlistName}
            error=${error} />
        <//>
      </div>
    `
  }

  renderWatchlist( watchlistId ) {
    return html`
      <div>Watch list</div>
    `
  }

  _openCreateWatchlistModal = () => {
    this.setState({isCreatingWatchlist: true});
    this.forceUpdate();
  }
  _closeCreateWatchlistModal = () => {
    this.setState({isCreatingWatchlist: false});
    this.forceUpdate();
  }
  _checkWatchlistCreation = () => {
    let value = this.state.createWatchlistName.trim();
    if( !value ){
      this.setState({error: 'Please type a name for the watch list'});
    }
    else {
      this.props.onCreateWatchlist( value )
    }
  }
}