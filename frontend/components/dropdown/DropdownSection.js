import { html } from "../../vendor/preact.js";

export function DropdownSection(props) {
  const {topSeparator, bottomSeparator} = this.props;
  const classes = mergeClassNames(
    'section',
    topSeparator && 'section--separator-top',
    bottomSeparator && 'section--separator-bottom'
  )

  const separator = html`
    <div class="separator"></div>
  `
  return html`
    <div class=${classes}>
      ${ topSeparator ? renderSeparator('top') : null }
      ${props.children}
      ${ bottomSeparator ? renderSeparator('bottom') : null }
    </div>
  `
}

function renderSeparator(type) {
  return html`
    <div class=${`separator separator--${type}`}></div>
  `
}


function mergeClassNames(...args) {
  return args.filter(Boolean).join(" ");
}