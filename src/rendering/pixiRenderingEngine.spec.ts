import { PixiRenderingEngine } from './pixiRenderingEngine';
import PIXI, { Viewport } from '../lib/pixi';
import { Vector } from '../utils';

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

  describe('position conversion', () => {
    it('should convert a screen to world position', () => {
      const pixiRendering = new PixiRenderingEngine('game');
      pixiRendering.world = new Viewport({
        screenWidth: 400, // Screen 400x300
        screenHeight: 300,
        noTicker: true,
      });
      const screenPos = new Vector(100, 100);
      expect(pixiRendering.screenToWorldPosition(screenPos)).toMatchObject({
        x: 100,
        y: 100,
        z: 0,
      });
      pixiRendering.world.moveCorner(150, 150); // Move top left corner by 100
      expect(pixiRendering.screenToWorldPosition(screenPos)).toMatchObject({
        x: 250,
        y: 250,
        z: 0,
      });
    });

    it('should convert a world to screen position', () => {
      const pixiRendering = new PixiRenderingEngine('game');
      pixiRendering.world = new Viewport({
        screenWidth: 400, // Screen 400x300
        screenHeight: 300,
        noTicker: true,
      });
      const worldPos = new Vector(100, 100);
      expect(pixiRendering.worldToScreenPosition(worldPos)).toMatchObject({
        x: 100,
        y: 100,
        z: 0,
      });
      pixiRendering.world.moveCorner(150, 150); // Move top left corner by 100
      expect(pixiRendering.worldToScreenPosition(worldPos)).toMatchObject({
        x: -50,
        y: -50,
        z: 0,
      });
    });
  });
});
