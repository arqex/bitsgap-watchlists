import {createElement} from './react-core.js';
import htm from './htm.js'

export const html = htm.bind(createElement);
export * from './react-core.js'
