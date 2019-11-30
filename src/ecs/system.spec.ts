import { YaveSystem, YaveRenderingSystem } from './system';

describe('YaveSystem', () => {
  class TestSystem extends YaveSystem {
    process = jest.fn();
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
});

describe('YaveRenderingSystem', () => {
  class TestRenderingSystem extends YaveRenderingSystem {
    process = jest.fn();
  }

  let system: TestRenderingSystem;

  beforeEach(() => (system = new TestRenderingSystem()));

  describe('initial', () => {
    it('should have isRenderSystem set to true', () => {
      expect(system.isRenderSystem).toBe(true);
    });
  });
});
