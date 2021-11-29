import { html } from "../../vendor/preact.js";
import { ModalBox } from "./ModalBox.react.js";
import { ModalOverlay } from "./ModalOverlay.react.js";

export function ConfirmationModal(props) {
  const {
    title, children, onConfirm, onCancel,
    confirmText='Ok',
    cancelText='Cancel'} = props;
  
  return html`
    <${ModalOverlay} onClick=${onCancel}>
      <${ModalBox} onClose=${onCancel} title=${title}>
        <div>
          ${children}
        </div>
        <div class="modal-controls">
          ${ renderCancelButton(onCancel, cancelText) }
          <button onClick=${onConfirm}>${confirmText}</button>
        </div>
      <//>
    <//>
  `
}


function renderCancelButton(onCancel, cancelText) {
  if( !onCancel ) return;

  return html`
    <button onClick=${onCancel}>${cancelText}</button>
  `
}