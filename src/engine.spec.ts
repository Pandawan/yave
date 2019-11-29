import { YaveEngine } from './index';
import { YaveECS } from './ecs';
import { AbstractRendering } from './rendering';
import PIXI from './lib/pixi';

describe('YaveEngine', () => {
  let engine: YaveEngine;

  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    engine = new YaveEngine();
    PIXI.utils.skipHello();
  });

  describe('initial', () => {
    it('should have an ECS instance', () => {
      expect(engine.ecs).toBeInstanceOf(YaveECS);
    });

    it('should have an AbstractRendering instance', () => {
      expect(engine.rendering).toBeInstanceOf(AbstractRendering);
    });

    it('should be stopped', () => {
      expect(engine.status).toBe('stopped');
    });

    it('should not have any listeners', () => {
      expect(engine.onInit.count).toBe(0);

      expect(engine.onStop.count).toBe(0);

      expect(engine.onUpdate.count).toBe(0);
    });

    it('should have a default timestep', () => {
      expect(engine.timeStep).not.toBe(0);
    });

    it('should not be executing the game loop', () => {
      expect((engine as any)._frameId).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should call onInit after initialization', async () => {
      const onInitSpy = jest.fn();
      engine.onInit.subscribe(onInitSpy);
      await engine.init();
      expect(onInitSpy).toBeCalled();
    });

    it('should be running', async () => {
      await engine.init();
      expect(engine.status).toBe('running');
    });

    it('should be initializing the rendering engine', async () => {
      engine.rendering.init = jest.fn();
      await engine.init();
      expect(engine.rendering.init).toBeCalled();
    });

    it('should load resources on the rendering engine', async () => {
      engine.rendering.load = jest.fn();
      await engine.init();
      expect(engine.rendering.load).toBeCalled();
    });

    it('should be executing the game loop', async () => {
      await engine.init();
      expect(typeof (engine as any)._frameId).toBe('number');
    });

    it('should throw when trying to init while already running', async () => {
      await engine.init();
      expect(engine.init()).rejects.toThrow();
    });
  });

  describe('pause', () => {
    it('should be paused when calling setPaused(true) while running', async () => {
      await engine.init();
      engine.setPaused(true);
      expect(engine.status).toBe('paused');
    });

    it('should be paused when calling setPaused(true) while already paused', async () => {
      await engine.init();
      engine.setPaused(true);
      engine.setPaused(true);
      expect(engine.status).toBe('paused');
    });

    it('should be running when calling setPaused(false) while paused', async () => {
      await engine.init();
      engine.setPaused(true);
      engine.setPaused(false);
      expect(engine.status).toBe('running');
    });

    it('should be running when calling setPaused(false) while already running', async () => {
      await engine.init();
      engine.setPaused(false);
      expect(engine.status).toBe('running');
    });

    it('should throw an error when calling setPaused while stopped', () => {
      expect(() => engine.setPaused(false)).toThrow();
      expect(() => engine.setPaused(true)).toThrow();
    });
  });

  describe('update', () => {
    it('should call onUpdate on every update', async done => {
      const onUpdateSpy = jest.fn((delta: number | undefined) => {
        // Check that the parameter passed is a number
        expect(typeof delta).toBe('number');
        done();
      });

      engine.onUpdate.subscribe(onUpdateSpy);
      await engine.init();
    });
  });

  describe('render', () => {
    it('should call onRender on every render', async done => {
      const onRenderSpy = jest.fn((delta: number | undefined) => {
        // Check that the parameter passed is a number
        expect(typeof delta).toBe('number');
        done();
      });

      engine.onRender.subscribe(onRenderSpy);
      await engine.init();
    });

    it("should call the rendering engine's render function", async () => {
      engine.rendering.render = jest.fn();
      await engine.init();
      expect(engine.rendering.render).toBeCalled();
    });
  });

  describe('stop', () => {
    it('should call onStop before stopping', async () => {
      const onStopSpy = jest.fn();
      engine.onStop.subscribe(onStopSpy);
      await engine.init();
      engine.stop();
      expect(onStopSpy).toBeCalled();
    });

    it('should be stopped', async () => {
      await engine.init();
      engine.stop();
      expect(engine.status).toBe('stopped');
    });

    it('should not be executing the game loop', async () => {
      await engine.init();
      engine.stop();
      expect((engine as any)._frameId).toBeNull();
    });

    it('should throw when trying to stop while already stopped', async () => {
      await engine.init();
      engine.stop();
      expect(() => engine.stop()).toThrow();
    });
  });
});
