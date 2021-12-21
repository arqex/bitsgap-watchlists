import memoizeOne from "../../../vendor/memoize-one.js";
import { html, Component } from "../../../vendor/preact.js";
import { DropdownButton } from "../../dropdown/DropdownButton.js";
import { DropdownItem } from "../../dropdown/DropdownItem.js";
import { DropdownSection } from "../../dropdown/DropdownSection.js";
import { Reveal } from "../../dropdown/Reveal.js";
import {CreateWatchlistModal} from "../CreateWatchlistModal.js";

export class WatchlistSelector extends Component {
  state = {
    open: false,
    createModalOpen: false,
  }

  render() {
    const {watchlists, selected} = this.props;

    return html`
      <div class="bge_watchlist_selector">
        <${DropdownButton}
          onClick=${ this._toggle }
          open=${ this.state.open }>
          ${selected.name}
        <//>
        <div class="selector-panel">
          <${Reveal}
            open=${this.state.open}
            onClickOut=${this._checkClose}>
            ${ () => html`
              <div class="bge_dropdown_panel">
                <${DropdownSection}>
                  <${DropdownItem} onClick=${this._openCreateModal}>
                    <i class="fas fa-plus"></i>
                    Create new watchlist
                  <//>
                <//>
                <${DropdownSection} topSeparator>
                  <${DropdownItem} onClick=${ () => this._onSelect('favourites') }>
                    <i class="far fa-star"></i>
                    Favourites
                  <//>
                <//>
                <${DropdownSection} topSeparator>
                  ${ sort(watchlists).map( this._renderListItem ) }
                <//>
              </div>
            `}
          <//>
        </div>
        <${CreateWatchlistModal}
          open=${this.state.createModalOpen}
          onCancel=${ this._closeCreateModal }
          onConfirm=${ this._onCreate } />
      </div>
    `
  }

  _renderListItem = watchlist => {
    const { onRemove } = this.props;
    return html`
      <${DropdownItem }
        id=${watchlist.id}
        onClick=${ this._onSelect }
        onRemove=${ onRemove }>
        ${watchlist.name}
      <//>
    `
  }

  _toggle = e => {
    e.preventDefault();
    this.setState({open: !this.state.open});
  }

  _checkClose = () => {
    if( this.state.open ){
      this.setState({open: false});
    }
  }

  _openCreateModal = () => {
    this.setState({
      open: false,
      createModalOpen: true
    });
  }

  _closeCreateModal = () => {
    this.setState({createModalOpen: false});
  }

  _onCreate = name => {
    this.props.onCreate(name);
    this._closeCreateModal();
  }

  _onSelect = id => {
    this.setState({open: false});
    this.props.onSelect(id);
  }
}

const sort = memoizeOne( watchlists => {
  const sorted = [...watchlists];
  sorted.sort( (a,b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
  return sorted;
})