import { html } from "../../vendor/preact.js";
 
export function InputGroup( props ) {
  const {name, label, value, error, onChange} = props;

  return html`
    <div class="bge_input_group">
      <label for=${name}>${label}</label>
      <input type="text" name=${name} value=${value} onChange${onChange} />
      ${ renderErrorMessage(error) }
    </div>
  `
}


function renderErrorMessage(error) {
  if( !error ){
    return;
  }

  return html`
    <div class="error_message">
      ${error}
    </div>
  `
}