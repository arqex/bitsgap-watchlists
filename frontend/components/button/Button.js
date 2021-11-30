import { html } from "../../vendor/preact.js";

export function Button(props) {
  const {onClick, type} = props;
  let classes = mergeClasses([
    'bge_button',
    type
  ])

  return html`
    <button class="${classes}" onClick=${onClick}>
      ${ this.props.children }
    </button>
  `
}


function mergeClasses( classList ) {
  // Any falsy class would be removed from the list
  return classList.filter( cl => cl ).join(' ');
}