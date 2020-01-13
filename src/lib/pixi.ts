// See: https://github.com/pixijs/pixi.js/issues/6227
import PIXI = require('pixi.js'); // TODO: Perhaps use @pixi/packages instead
window.PIXI = PIXI;

// Tilemap
import 'pixi-tilemap';
// Patch the tilemap with slightly modified functions for easier API usage
import './tilemapPatch';

export { Viewport } from 'pixi-viewport';

export default PIXI;
