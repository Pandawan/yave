// See: https://github.com/pixijs/pixi.js/issues/6227
import PIXI = require('pixi.js'); // TODO: Perhaps use @pixi/packages instead
window.PIXI = PIXI;
import 'pixi-tilemap';

export default PIXI;
