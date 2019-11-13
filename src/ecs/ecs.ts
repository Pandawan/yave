import { Engine, EngineMode } from '@trixt0r/ecs';
import { RunOptions } from './runOptions';
import { YaveEngine } from '../engine';

export class YaveECS extends Engine {
  /**
   * Reference to the actual yave engine that uses this ECS engine.
   */
  public readonly yaveEngine: YaveEngine;

  /** @inheritdoc */
  constructor(engine: YaveEngine) {
    super();
    this.yaveEngine = engine;
  }

  /**
   * Updates all systems in this engine with the given options.
   *
   * @param {RunOptions} options
   * @param {EngineMode} [mode = EngineMode.DEFAULT]
   * @returns {void | Promise<void>}
   */
  run(
    // Overriding run with an interface "RunOptions" so that isRenderSystem can work (also make it required)
    options: RunOptions,
    mode: EngineMode = EngineMode.DEFAULT
  ): void | Promise<void> {
    return this[mode](options);
  }
}