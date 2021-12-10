import { Component, createRef } from "../../vendor/preact.js";
import { html } from "../../vendor/preact.js";

export class Reveal extends Component {
  container = createRef();

  render() {
    if(!this.props.open) return null;

    return html`
      <div class="reveal" ref=${this.container}>
        ${ this.props.children() }
      </div>
    `
  }

  _onDocumentClick = (e) => {
    if( e.defaultPrevented ) return;

    const {open, onClickOut} = this.props;

    if( open && onClickOut && !this.container?.current.contains(e.target) ){
      onClickOut();
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this._onDocumentClick );
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this._onDocumentClick );
  }
}