import { YaveEngine } from '../engine';
import { YaveECS } from './ecs';
import { YaveEntity } from './entity';
import { YaveEntitySystem, YaveEntityRenderingSystem } from './entitySystem';
import { Aspect, Component } from '@trixt0r/ecs';
import { RunOptions } from './runOptions';

// TODO: Clean up "Common" tests, they were taken directly from @trixt0r/ecs and are kind of messy

jest.mock('../engine');

class TestComponent1 implements Component {}
class TestComponent2 implements Component {}
class TestComponent3 implements Component {}
class TestComponent4 implements Component {}

// Tests taken from @trixt0r/ecs
describe('YaveEntitySystem (Common)', () => {
  class TestEntitySystem extends YaveEntitySystem {
    entities: YaveEntity[] = [];
    processEntity(entity: YaveEntity): void {
      this.entities.push(entity);
    }

    getAspect(): Aspect {
      if (this.aspect === null) throw new Error('Aspect is null');
      return this.aspect;
    }
  }

  let mockEngine: YaveEngine;
  let mockECS: YaveECS;
  let mockRunOptions: RunOptions;

  beforeEach(() => {
    mockEngine = new YaveEngine();
    mockECS = new YaveECS(mockEngine);
    mockRunOptions = {
      deltaTime: 0,
      isRendering: false,
    };
  });

  it('should process each entity in the engine', () => {
    mockECS.entities.add(new YaveEntity(), new YaveEntity(), new YaveEntity());
    const system = new TestEntitySystem();
    mockECS.systems.add(system);
    mockECS.run(mockRunOptions);
    expect(system.entities.length).toBe(mockECS.entities.length);
    mockECS.entities.forEach((entity: YaveEntity, i: number) => {
      expect(system.entities[i]).toBe(entity);
    });
  });

  it('should process each entity fitting the provided aspects', () => {
    mockECS.entities.add(new YaveEntity(), new YaveEntity(), new YaveEntity());
    mockECS.entities.elements[0].components.add(
      new TestComponent1(),
      new TestComponent2(),
      new TestComponent4()
    );
    mockECS.entities.elements[1].components.add(
      new TestComponent1(),
      new TestComponent2(),
      new TestComponent3()
    );
    mockECS.entities.elements[2].components.add(
      new TestComponent1(),
      new TestComponent2()
    );

    const system = new TestEntitySystem(
      0,
      [TestComponent1],
      [TestComponent3],
      [TestComponent4, TestComponent2]
    );
    mockECS.systems.add(system);
    mockECS.run(mockRunOptions);
    expect(system.entities.length).toBe(2);
  });

  it('should detach the aspect after removing the system from the engine', () => {
    const system = new TestEntitySystem(
      0,
      [TestComponent1],
      [TestComponent3],
      [TestComponent4, TestComponent2]
    );
    mockECS.systems.add(system);
    expect(system.getAspect()?.isAttached).toBe(true);
    mockECS.systems.remove(system);
    expect(system.getAspect()?.isAttached).toBe(false);
  });

  it('should call all entity and component related methods', () => {
    const system = new TestEntitySystem();
    mockECS.systems.add(system);

    const methodsAndArgs = {
      onAddedEntities: [new YaveEntity(), new YaveEntity(), new YaveEntity()],
      onRemovedEntities: [new YaveEntity(), new YaveEntity(), new YaveEntity()],
      onClearedEntities: [],
      onSortedEntities: [],
      onAddedComponents: [
        new YaveEntity(),
        [new TestComponent1(), new TestComponent2()],
      ],
      onRemovedComponents: [
        new YaveEntity(),
        [new TestComponent1(), new TestComponent2()],
      ],
      onClearedComponents: [new YaveEntity()],
      onSortedComponents: [new YaveEntity()],
    };
    const keys = Object.keys(methodsAndArgs);
    let calledTimes = 0;
    keys.forEach((method: string) => {
      let calledArgs: any[] | undefined = undefined;
      const methodArgs = (methodsAndArgs as any)[method];
      (system as any)[method] = function(...args: any[]) {
        calledArgs = Array.prototype.slice.call(args);
      };
      (system.getAspect() as any).dispatch.apply(system.getAspect(), [
        method,
        ...methodArgs,
      ]);
      expect(calledArgs).toBeDefined();
      expect(calledArgs).toEqual(methodArgs);
      calledTimes++;
    });
    expect(calledTimes).toBe(keys.length);
  });
});

describe('YaveEntitySystem', () => {
  class TestEntitySystem extends YaveEntitySystem {
    processEntity = jest.fn();
  }

  let system: TestEntitySystem;

  beforeEach(() => {
    system = new TestEntitySystem();
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

describe('YaveEntityRenderingSystem', () => {
  class TestEntityRenderingSystem extends YaveEntityRenderingSystem {
    processEntity = jest.fn();
  }

  let system: TestEntityRenderingSystem;

  beforeEach(() => {
    system = new TestEntityRenderingSystem();
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
