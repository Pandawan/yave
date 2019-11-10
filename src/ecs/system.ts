import { AbstractEntitySystem } from '@trixt0r/ecs';
import { YaveEntity } from './entity';
import { RunOptions } from './runOptions';
import { YaveEngine } from '../engine';
import { YaveECS } from './ecs';

/**
 * Simple wrapper over System with support for YaveEntity
 */
export abstract class YaveSystem extends AbstractEntitySystem<YaveEntity> {
  /**
   * The reference to the Yave engine.
   */
  protected _yaveEngine: YaveEngine | null = null;

  /**
   * The reference to the ECS engine.
   */
  protected _engine: YaveECS | null = null;

  /**
   * Whether or not this system should run in the render loop (instead of the tick loop).
   */
  public readonly isRenderSystem: boolean = false;

  /**
   * The ECS engine this system is assigned to.
   */
  get engine(): YaveECS | null {
    return this._engine;
  }
  set engine(engine: YaveECS | null) {
    super.engine = engine;
    // Update yaveEngine property as well
    if (engine !== null) this._yaveEngine = engine.yaveEngine;
  }

  /**
   * The Yave engine this system is assigned to.
   */
  get yaveEngine(): YaveEngine | null {
    return this._yaveEngine;
  }

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
