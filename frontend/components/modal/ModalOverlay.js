import { html, createPortal } from "../../vendor/preact-portals.js";


export function ModalOverlay(props) {
  const {open, children, onClick = () => {}} = props;

  if( !open ) return null;

  if( open ){
    return createPortal(
      html`
        <div class="modal-overlay"
          onClick=${onClick}>
          ${ children() }
        </div>
      `,
      getModalElement()
    );
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