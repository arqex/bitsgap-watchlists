import { html } from "../../vendor/preact.js";
import { Button } from "../button/Button.js";

export function ModalBox(props){
  const {onClose, title, children} = props;

  return html`
    <div class="box">
      <div class="header">
        <span class="title">${title}</span>
        ${ renderCloseButton(onClose) }
      </div>
      <div class="body">
        ${children}
      </div>
    </div>
  `
}


function renderCloseButton(onClose){
  if( !onClose ) return;

  return html`
    <div class="modal-close">
      <${Button} type="transparent" onClick=${onClose}>
        x
      <//>
    </div>
  `
}