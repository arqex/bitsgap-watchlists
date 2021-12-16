import { Component, html } from "../../vendor/preact.js";
import { ModalBox } from "../modal/ModalBox.js";
import { ModalOverlay } from "../modal/ModalOverlay.js";
import { PairSelector } from "./PairSelector.js";

export class PairSelectorModal extends Component {
  render() {
    const {open, onClose, mode, onSelected, connectedExchanges} = this.props;
    let title = mode === 'add' ? 'Add pairs' : 'Pair search';

    return html`
      <${ModalOverlay} open=${open} onClick=${onClose}>
        ${ () => html`
          <${ModalBox} onClose=${onClose} title=${title}>
            <${PairSelector}
              onSelected=${onSelected}
              connectedExchanges=${connectedExchanges} />
          <//>
        `}
      <//>
    `
  }
}