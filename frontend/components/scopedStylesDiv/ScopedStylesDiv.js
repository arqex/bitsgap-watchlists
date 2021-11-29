import { Component, html, render } from "../../vendor/preact.js";

export class ScopedStylesDiv extends Component {
  render() {
    const {styles, children, ...divProps} = this.props; 

    return html`
      <div
        ref=${ this._renderShadow }
        ...${divProps} />
    `
  }
  _renderShadow = (node) => {
    let shadow = node.shadowRoot || node.attachShadow({mode: 'open'});
    shadow.adoptedStyleSheets = [this.props.styles];
    render( this.props.children, shadow);
  }
}