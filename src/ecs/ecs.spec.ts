import { YaveEngine } from '../engine';
import { YaveECS } from './ecs';
import { YaveRenderingSystem, YaveSystem } from './system';
import { System } from '@trixt0r/ecs';

// Create a mock implementation of YaveEngine so it doesn't actually do anything
jest.mock('../engine');

class TestUnknownSystem extends System {
  process = jest.fn();
}
class TestSystem extends YaveSystem {
  process = jest.fn();
}
class TestRenderingSystem extends YaveRenderingSystem {
  process = jest.fn();
}

describe('YaveECS', () => {
  const mockEngine = new YaveEngine();

  const ecs = new YaveECS(mockEngine);

  it('should have a yaveEngine property', () => {
    expect(ecs.yaveEngine).toBeInstanceOf(YaveEngine);
    expect(ecs.yaveEngine).toBe(mockEngine);
  });

  describe('run', () => {
    let unknownSystem: TestUnknownSystem;
    let basicSystem: TestSystem;
    let renderSystem: TestRenderingSystem;

    beforeEach(() => {
      unknownSystem = new TestUnknownSystem();
      basicSystem = new TestSystem();
      renderSystem = new TestRenderingSystem();

      ecs.systems.add(unknownSystem, basicSystem, renderSystem);
    });

    /*

                        isRendering
                          Y   N   U
                        - - - - - - -
                      Y | O | X | X |
                        - - - - - - -
      isRenderSystem  N | X | O | O |
                        - - - - - - -
                      U | X | O | O |
                        - - - - - - -
      */
    it('should run render systems only when isRendering is true', () => {
      ecs.run({ deltaTime: 0, isRendering: true });
      expect(renderSystem.process).toBeCalled(); // Only render is called
      expect(basicSystem.process).not.toBeCalled();
      expect(unknownSystem.process).not.toBeCalled();
    });

    it('should run normal and unknown systems when isRendering is false', () => {
      ecs.run({ deltaTime: 0, isRendering: false });
      expect(renderSystem.process).not.toBeCalled();
      expect(unknownSystem.process).toBeCalled(); // Unknown is called
      expect(basicSystem.process).toBeCalled(); // Basic is called
    });

    it('should run normal and unknown systems when options is undefined', () => {
      ecs.run(undefined as any);
      expect(renderSystem.process).not.toBeCalled();
      expect(unknownSystem.process).toBeCalled(); // Unknown is called
      expect(basicSystem.process).toBeCalled(); // Basic is called
    });

    it('should run normal and unknown systems when isRendering is undefined', () => {
      ecs.run({ deltaTime: 0 } as any);
      expect(renderSystem.process).not.toBeCalled();
      expect(unknownSystem.process).toBeCalled(); // Unknown is called
      expect(basicSystem.process).toBeCalled(); // Basic is called
    });
  });
});
