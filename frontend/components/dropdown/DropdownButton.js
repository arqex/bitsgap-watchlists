import { Component, html } from "../../vendor/preact.js";

export class DropdownButton extends Component {
  render() {
    let classes = mergeClasses([
      'bge_dropdown-button',
      this.props.open && 'open'
    ]);

    return html`
      <button class=${classes} onClick=${this.props.onClick}>
        ${this.props.children}
        <i class="fas fa-caret-down"></i>
      </button>
    `
  }
}

function mergeClasses(classes) {
  return classes.filter( c => c ).join(' ');
}