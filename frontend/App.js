import { WatchlistPanel } from './components/watchlistPanel/WatchlistPanel.js';
import {html} from './vendor/preact.js';

export function App() {
  return html`
    <${WatchlistPanel} />
  `
}
