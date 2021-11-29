import { html } from "../../vendor/preact.js";

export function ModalBox(props){
  const {onClose, title, children} = props;

  return html`
    <div class="modal-box">
      <div class="modal-box-header">
        <span class="modal-box-title">${title}</span>
        ${ renderCloseButton(onClose) }
      </div>
      <div class="modal-box-body">
        ${children}
      </div>
    </div>
  `
}


function renderCloseButton(onClose){
  if( !onClose ) return;

  return html`
    <a onClick=${ onClose }>x</a>
  `
}