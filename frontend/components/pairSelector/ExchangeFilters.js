import memoizeOne from "../../vendor/memoize-one.js";
import { html } from "../../vendor/preact.js";

export function ExchangeFilters({exchanges, connected, selected, onSelect}) {
  return html`
    <div class="exchangeFilters">
      ${ getOptions(exchanges, connected).map( exchange => (
        html`
          <${ExchangeFilter}
            key=${exchange}
            selected=${ exchange === selected }
            onClick=${ onSelect }>
              ${exchange}
          <//>
        `
      ))}
    </div>
  `
}


export function ExchangeFilter({selected, onClick, children}) {
  const classes = mergeClasses(
    'exchangeFilter',
    selected && 'selected'
  );

  return html`
    <div class=${classes}
      onClick=${ e => onClick(children) }>
        ${children}
    </div>
  `
}

const getOptions = memoizeOne( ( exchanges, connected ) => {
  if( connected.length === 0 ){
    return [
      'all',
      ...exchanges
    ]
  }

  let options = ['all', 'connected', ...connected];
  exchanges.forEach( exchange => {
    if( !connected.includes(exchange) )
      options.push(exchange);
  });
  return options;
})



function mergeClasses(...classes) {
  return classes.filter( Boolean ).join(' ');
}