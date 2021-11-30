import { html, Component } from "../../vendor/preact.js";
import { Button } from "../button/Button.js";
import { ModalBox } from "./ModalBox.js";
import { ModalOverlay } from "./ModalOverlay.js";

export function ConfirmationModal(props) {
  const {
    title, children, onConfirm, onCancel, open,
    confirmText='Ok',
    cancelText='Cancel'} = props;
  
  return html`
    <${ModalOverlay} onClick=${onCancel} open=${open}>
      ${ () => (
        html`
          <${ModalBox} onClose=${onCancel} title=${title}>
            <div class="confirmation-modal-body">
              ${children}
            </div>
            <div class="confirmation-modal-controls">
              <div class="confirmation-cancel">
                ${ renderCancelButton(onCancel, cancelText) }
              </div>
              <div class="confirmation-confirm">
                <${Button} onClick=${onConfirm}>${confirmText}<//>
              </div>
            </div>
          <//>
        `
      )}
    <//>
  `
}


function renderCancelButton(onCancel, cancelText) {
  if( !onCancel ) return;

  return html`
    <${Button} type="transparent" onClick=${onCancel}>${cancelText}<//>
  `
}