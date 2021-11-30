import { html, Component, createRef } from "../../vendor/preact.js";

export class InputGroup extends Component {
  input = createRef()
  render() {
    const {name, label, value, error, onChange, onKeyPress} = this.props;

    const classes = mergeClasses([
      'bge_input_group',
      error && 'bge_error'
    ])

    return html`
      <div class="bge_input_group">
        <label for=${name}>${label}</label>
        <input type="text"
          ref=${this.input}
          name=${name}
          value=${value}
          onChange=${onChange}
          onKeyPress=${onKeyPress}  />
        ${ this.renderError() }
      </div>
    `
  }

  renderError() {
    const {error} = this.props;
    if( error ){
      return html`
        <div class="error_message">
          ${error}
        </div>
      `
    }
  }

  focus(){
    this.input.current?.focus();
  }
}


function mergeClasses( classList ){
  // Any not falsy value
  return classList.filter(cl => cl).join(' ');
}