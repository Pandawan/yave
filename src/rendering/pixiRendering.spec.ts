import { PixiRendering } from './pixiRendering';
import { Application as PixiApplication, utils } from 'pixi.js';

describe('PixiRendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    utils.skipHello();
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
      expect(pixiRendering.renderingEngine).toBeInstanceOf(PixiApplication);
    });
  });
});
