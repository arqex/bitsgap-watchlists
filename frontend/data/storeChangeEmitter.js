let clbks = [];

export function addChangeListener( clbk ){
  clbks.push(clbk)
}

export function removeChangeListener( clbk ){
  clbks = clbks.filter( c => c !== clbks );
}

export function emitChange(){
  clbks.forEach( clbk => clbk() )
}