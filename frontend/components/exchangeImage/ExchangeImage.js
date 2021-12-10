import { html } from "../../vendor/preact.js";

export function ExchangeImage(props) {
  const {exchange, size=18} = props;
  return html`
    <img 
      alt=${exchange}
      src=${`/assets/images/markets/${exchange.split('|')[0]}.png`}
      style=${`width: ${size}px; height: ${size}px`} />

  `
}