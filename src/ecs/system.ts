import { System } from '@trixt0r/ecs';
import { RunOptions } from './runOptions';
import { YaveEngine } from '../engine';
import { YaveECS } from './ecs';

/**
 * Basic ECS System.
 */
export abstract class YaveSystem extends System {
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
  abstract process(options?: RunOptions): void | Promise<void>;
}

/**
 * Basic ECS System meant to run during the Render loop.
 */
export abstract class YaveRenderingSystem extends YaveSystem {
  /** @inheritdoc */
  public readonly isRenderSystem = true;
}
