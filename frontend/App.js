import { Watchlists } from './components/watchlists/Watchlists.js';
import {html} from './vendor/preact.js';

export function App() {
  return html`
    <${Watchlists} />
  `
}
