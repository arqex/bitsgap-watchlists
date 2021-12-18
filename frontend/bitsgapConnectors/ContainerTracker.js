export class ContainerTracker {
  container = null
  observer = null
  constructor( selector ) {
    let container = document.querySelector(selector);
    if( container ){
      this.container = container;
      /*
      // This observer doesn't work for resizing
      this.observer = new MutationObserver( () => {
        this.onDimensionsChange();    
      });

      this.observer.observe(this.container, {attributes: true});
      */
      
      // This observer doesn't track changes in element absolute position
      // Maybe it's better just poll at intervals
      this.observer = new ResizeObserver( container => {
        this.onDimensionsChange();
      })
      

      console.log( this.getDimensions() )
    }
  }

  clbks = []
  addChangeListener( clbk ) {
    this.clbks.push(clbk)
  }

  removeChangeListener(clbk) {
    this.clbks = this.clbks.filter( c => clbk !== c );
  }

  getDimensions( container ) {
    if( !container ) container = this.container;
    return {
      top: container.offsetTop,
      left: container.offsetLeft,
      height: container.offsetHeight,
      width: container.offsetWidth
    }
  }

  onDimensionsChange(){
    const dimensions = this.getDimensions();
    console.log('Dimensions changed!', dimensions);
    this.clbks.forEach( clbk => clbk(dimensions) );
  }
}