import { socketFeed } from "../../data/socketFeed.js";
import { Component, html } from "../../vendor/preact.js";
import Fuse from "../../vendor/fuse.js";

export class PairSelector extends Component {
  render() {
    const pairs = socketFeed.getValue('allPairs');
    const balances = socketFeed.getValue('balances');
    console.log(pairs, balances);

    return html`
      <div class="pairSelector">
        <div class="inputWrapper">
          <i class="fas fa-search"></i>
          <input placeholder="Search" />
        </div>
        <div class="exchanges">
          Algo aquí
        </div>
        <div class="resultsWrapper">
          Results here
        </div>
      </div>
    `;
  }

  componentDidMount() {
    const pairsByExchange = socketFeed.getValue('allPairs');
    let entries = [];
    for( let exchange in pairsByExchange ){
      pairsByExchange[exchange].forEach( pair => {
        entries.push({
          exchange,
          pair,
          tag: pair.replace('_', '').replace(/\(.*?\)/, '')
        })
      })
    }

    const options = {
      keys: [
        {name: 'exchange', weight: 1},
        {name: 'tag', weight: 2},
      ]
    }
    this.fuse = new Fuse(entries, options);
  }
}