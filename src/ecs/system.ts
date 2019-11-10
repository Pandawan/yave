import { AbstractEntitySystem } from '@trixt0r/ecs';
import { YaveEntity } from './entity';
import { RunOptions } from './runOptions';

/**
 * Simple wrapper over System with support for YaveEntity
 */
export abstract class YaveSystem extends AbstractEntitySystem<YaveEntity> {
  /**
   * Whether or not this system should run in the render loop (instead of the tick loop).
   */
  public readonly isRenderSystem: boolean = false;

  /* 
    TODO: Need a way to pass the YaveEngine (not just YaveECS) to systems
      - Perhaps the YaveECS could have a ref to YaveEngine, 
        and when adding a system (ie onAddedSystems), 
        it could set the "yave" property to be a ref to the YaveEngine
          This might be confusing though since System.engine = YaveECS (and System.yave = YaveEngine)
          it would be better if it was System.engine = YaveEngine (and System.ecs = YaveECS)
      - One other way is to simply require a constructor with (engine: YaveEngine) as parameter in YaveSystem
        But that's kind of ugly since it requires passing the engine when it really shouldn't (ie engine.ecs.systems.add(new YaveSystem(engine)))
  */

  /** @inheritdoc */
  process(options?: RunOptions): void {
    if (this._engine === null || this._engine === undefined) return;

    // Only run this system IF (rendering & isRenderSystem) OR (not rendering && not isRenderSystem)
    if (options !== undefined && options.isRendering !== this.isRenderSystem)
      return;

    const entities =
      this.aspect !== null && this.aspect !== undefined
        ? this.aspect.entities
        : this._engine.entities.elements;

    for (let i = 0, l = entities.length; i < l; i++) {
      this.processEntity(
        entities[i] as YaveEntity,
        i,
        entities as YaveEntity[],
        options
      );
    }
  }
}

/**
 * Simple wrapper over YaveSystem which automatically sets `isRenderSystem` to true
 */
export abstract class YaveRenderingSystem extends YaveSystem {
  /** @inheritdoc */
  public readonly isRenderSystem = true;
}
