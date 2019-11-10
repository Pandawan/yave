/* eslint-disable @typescript-eslint/no-explicit-any */

import { YaveSystem, YaveRenderingSystem } from './system';
import { RunOptions } from './runOptions';

describe('YaveSystem', () => {
  class TestSystem extends YaveSystem {
    processEntity = jest.fn();
  }

  let system: TestSystem;

  beforeEach(() => {
    system = new TestSystem();
  });

  describe('initial', () => {
    it('should have a null engine property', () => {
      expect(system.engine).toBeNull();
    });

    it('should have a null yaveEngine property', () => {
      expect(system.yaveEngine).toBeNull();
    });

    it('should have isRenderSystem set to false', () => {
      expect(system.isRenderSystem).toBe(false);
    });
  });

  describe('run', () => {
    beforeEach(() => {
      system.engine = { entities: { elements: [1], length: 1 } } as any;
    });

    it('should call the processEntity method when not in rendering mode', () => {
      const runOptions: RunOptions = {
        deltaTime: 5,
        isRendering: false,
      };

      system.run(runOptions);
      expect(system.processEntity).toBeCalled();
    });

    it('should not call the processEntity method when in rendering mode', () => {
      const runOptions: RunOptions = {
        deltaTime: 5,
        isRendering: true,
      };

      system.run(runOptions);
      expect(system.processEntity).not.toBeCalled();
    });
  });
});

describe('YaveRenderingSystem', () => {
  class TestRenderingSystem extends YaveRenderingSystem {
    processEntity = jest.fn();
  }

  let system: TestRenderingSystem;

  beforeEach(() => (system = new TestRenderingSystem()));

  describe('initial', () => {
    it('should have isRenderSystem set to true', () => {
      expect(system.isRenderSystem).toBe(true);
    });
  });

  describe('run', () => {
    beforeEach(() => {
      system.engine = { entities: { elements: [1], length: 1 } } as any;
    });

    it('should call the processEntity method when in rendering mode', () => {
      const runOptions: RunOptions = {
        deltaTime: 5,
        isRendering: true,
      };

      system.run(runOptions);
      expect(system.processEntity).toBeCalled();
    });

    it('should not call the processEntity method when not in rendering mode', () => {
      const runOptions: RunOptions = {
        deltaTime: 5,
        isRendering: false,
      };

      system.run(runOptions);
      expect(system.processEntity).not.toBeCalled();
    });
  });
});
