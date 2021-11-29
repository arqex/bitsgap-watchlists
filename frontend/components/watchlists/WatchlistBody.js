import { html } from "../../vendor/preact.js";

export function WatchlistBody(props) {
  return html`
    <div class="order-book-page__content">
      <div>Seems that you don't have any watchlist yet.</div>
      <button style="margin-top: 10px" onClick=$>
        Create a watchlist
      </button>
    </div>
  `
}