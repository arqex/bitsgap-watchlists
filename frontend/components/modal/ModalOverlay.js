import { html, createPortal, Component, createRef } from "../../vendor/preact.js";

export class ModalOverlay extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }

  overlay = createRef()

  render() {
    const {open, children, onClick = () => {}} = this.props;
  
    if( !open ) return null;
  
    if( open ){
      return createPortal(
        html`
          <div class="bge_modal"
            ref=${ this.overlay }
            onClick=${this._onClick}>
            ${ children() }
          </div>
        `,
        getModalElement()
      );
    }
  }

  _onClick(e) {
    if( e.target === this.overlay.current ){
      this.props.onClick();
    }
  }
}

const MODAL_ID = 'modalContainer';
function getModalElement() {
	let el = document.getElementById(MODAL_ID);

	if (!el) {
		el = document.createElement('div');
		el.id = MODAL_ID;
		document.body.appendChild(el);
	}

	return el;
}