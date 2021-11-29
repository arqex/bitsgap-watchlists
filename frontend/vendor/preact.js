import htm from './htm.js';
import { createElement } from './preact-core.js';

// this file will link all the preact parts
export * from './preact-core.js';
export {createPortal} from './preact-portals.js';
export const html = htm.bind(createElement);