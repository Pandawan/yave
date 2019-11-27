import { PixiRenderingEngine } from './pixiRenderingEngine';
import PIXI from '../lib/pixi';

describe('PixiRendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    PIXI.utils.skipHello();
  });

  describe('initial', () => {
    it('should have a null renderingEngine', () => {
      const pixiRendering = new PixiRenderingEngine('game');
      expect(pixiRendering.renderingEngine).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should create a new Pixi Application', () => {
      const pixiRendering = new PixiRenderingEngine('game');
      pixiRendering.init();
      expect(pixiRendering.renderingEngine).toBeInstanceOf(PIXI.Application);
    });
  });

  describe('resource loading', () => {
    it('should wait for the loader to load', async () => {
      const pixiRendering = new PixiRenderingEngine('game');
      pixiRendering.loader.load = jest.fn((cb: Function) => {
        cb();
      }) as any;

      await pixiRendering.load();
    });
  });

  describe('rendering', () => {
    it('should tell the renderingEngine to render', () => {
      const pixiRendering = new PixiRenderingEngine('game');
      pixiRendering.renderingEngine = {
        render: jest.fn(),
      } as any;
      pixiRendering.world = {
        update: jest.fn(),
      } as any;

      pixiRendering.render(1);

      expect(pixiRendering.renderingEngine?.render).toBeCalled();
      expect(pixiRendering.world?.update).toBeCalled();
    });
  });
});
