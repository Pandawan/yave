import { PixiRendering } from './pixiRendering';
import PIXI from '../lib/pixi';

describe('PixiRendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    PIXI.utils.skipHello();
  });

  describe('initial', () => {
    it('should have a null renderingEngine', () => {
      const pixiRendering = new PixiRendering('game');
      expect(pixiRendering.renderingEngine).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should create a new Pixi Application', () => {
      const pixiRendering = new PixiRendering('game');
      pixiRendering.init();
      expect(pixiRendering.renderingEngine).toBeInstanceOf(PIXI.Application);
    });
  });
});
