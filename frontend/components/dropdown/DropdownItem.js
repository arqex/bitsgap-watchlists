import { html } from "../../vendor/preact.js"
import { Button } from "../button/Button.js"

export function DropdownItem(props) {
  return html`
    <div onClick=${props.onClick} class="item">
      <span class="item-title">
        ${this.props.children}
      </span>
      ${ renderCloseButton(props) }
    </div>
  `
}


function renderCloseButton(props) {
  if( props.onRemove ){
    return html`
      <span class="item-remove">
        <${Button} type="transparent" onClick=${() => props.onRemove(props.id)}>
          <i class="fas fa-times"></i>
        <//>
      </span>
    `
  }
}