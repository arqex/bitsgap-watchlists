import { html } from "../../vendor/preact.js"
import { Button } from "../button/Button.js"

export function DropdownItem(props) {
  const {onClick, id} = props;
  return html`
    <div onClick=${ () => onClick(id) } class="item">
      <span class="itemTitle">
        ${this.props.children}
      </span>
      ${ renderCloseButton(props) }
    </div>
  `
}


function renderCloseButton(props) {
  if( props.onRemove ){
    return html`
      <span class="itemRemove">
        <${Button} type="transparent" onClick=${() => props.onRemove(props.id)}>
          <i class="fas fa-times"></i>
        <//>
      </span>
    `
  }
}