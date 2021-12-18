import { Component, html, createRef } from "../../vendor/preact.js";
import { InputGroup } from "../inputGroup/InputGroup.js";
import { ConfirmationModal } from "../modal/ConfirmartionModal.js";

export class CreateWatchlistModal extends Component {
  state = {
    name: '',
    error: ''
  }

  input = createRef()

  render() {
    const {onCancel, open} = this.props;
    return html`
      <${ConfirmationModal}
        open=${open}
        title="Create new watchlist"
        confirmText="Create"
        onCancel=${onCancel}
        onConfirm=${this._onCreate}>
          <${InputGroup}
            ref=${this.input}
            label="Enter a name for the watch list:"
            name="watchlistName"
            onChange=${this._onNameChange}
            onKeyPress=${this._onKeyPress}
            value=${this.state.name}
            error=${this.state.error} />
      <//>
    `
  }

  _onNameChange = e => {
    this.setState({name: e.target.value});
  }

  _onKeyPress = e => {
    if( e.key === 'Enter' ){
      e.preventDefault();
      this._onCreate();
    }
  }

  _onCreate = () => {
    const name = this.state.name.trim();
    if( !name ){
      this.setState({
        error: 'Please type a name for the watch list'
      });
      return;
    }
    
    this.props.onConfirm(name);
  }

  componentDidUpdate(prevProps) {
    if( !prevProps.open && this.props.open ){
      this.input.current?.focus();
    }
    else if(prevProps.open && !this.props.open ){
      this.setState({name: '', error: ''});
    }
  }
}