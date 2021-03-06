import { App } from './App.js';
import { socketFeed } from './data/socketFeed.js';
import { addChangeListener as onStoreChange } from './data/storeChangeEmitter.js';
import { addChangeListener as onFrontendStoreChange } from './data/frontendStore.js';
import {html, render, Component} from './vendor/preact.js';

class Root extends Component {
  state = {
    currentRoute: window.location.pathname
  }

  render(){
    // Only for the trading section
    if( isTradingRoute(this.state.currentRoute) ){
      return (html`
        <${App} />
      `)
    }
    return null;
  }

  componentDidMount(){
    this.listenToNavigation();
    onStoreChange( () => this.forceUpdate() );
    onFrontendStoreChange( () => this.forceUpdate() );
    this.checkDataInitialization( this.state.currentRoute );
  }

  listenToNavigation(){
    // listening to popstate won't work with bitsgap
    // We are going to observe changes in the content of the page to
    // avoid polling to check when the route has changed
    let container = document
      .querySelector('.page-header')
      .parentElement.parentElement.children[1]
    ;

    if( container ){
      let observer = new MutationObserver( () => {
        if( window.location.pathname !== this.state.currentRoute ){
          this.onNavigation();
        }
      });
      observer.observe( container, {childList: true} );
    }
  }

  previousRoute = '';
  checkDataInitialization( currentRoute ){
    if( currentRoute !== this.previousRoute ){
      if( isTradingRoute(currentRoute) ){
        socketFeed.startListening();
      }
      else {
        socketFeed.stopListening();
      }
    }
  }

  onNavigation() {
    const currentRoute = window.location.pathname;
    this.checkDataInitialization( currentRoute );
    console.log('setting route', currentRoute);
    this.setState({currentRoute})
  }
}

function isTradingRoute( route ){
  return route === '/trading';
}


export function mount( rootNode ){
  const app = html`
    <${Root} />
  `

  render( app, rootNode );
}

/*
// We want to listen from the bitsgap data in the future

import { socket } from './bitsgapConnectors/getSocket.js';
socket.addMessageListener( message => {
  console.log( message );
});
*/