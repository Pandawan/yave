import { Engine, EngineMode, SystemMode, System } from '@trixt0r/ecs';
import { RunOptions } from './runOptions';
import { YaveEngine } from '@/engine';
import { YaveSystem } from './system';

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

  /**
   * Updates all systems in this engine with the given options,
   * without waiting for a resolve or reject of each system.
   *
   * @param {RunOptions} [options]
   * @returns {void}
   */
  protected runDefault(options?: RunOptions): void {
    const length = this._activeSystems.length;
    for (let i = 0; i < length; i++) {
      if (this.shouldRunSystem(this._activeSystems[i], options)) {
        this._activeSystems[i].run(options, SystemMode.SYNC);
      }
    }
  }

  /**
   * Updates all systems in this engine with the given options,
   * by waiting for a system to resolve or reject before continuing with the next one.
   *
   * @param {RunOptions} [options]
   * @returns {Promise<void>}
   */
  protected async runSuccessive(options?: RunOptions): Promise<void> {
    const length = this._activeSystems.length;
    for (let i = 0; i < length; i++)
      if (this.shouldRunSystem(this._activeSystems[i], options)) {
        await this._activeSystems[i].run(options, SystemMode.SYNC);
      }
  }

  /**
   * Updates all systems in this engine with the given options,
   * by running all systems in parallel and waiting for all systems to resolve or reject.
   *
   * @param {RunOptions} [options]
   * @returns {Promise<void>}
   */
  protected async runParallel(options?: RunOptions): Promise<void> {
    const mapped = this._activeSystems.map(system => {
      if (this.shouldRunSystem(system, options)) {
        return system.run(options, SystemMode.ASYNC);
      }
    });
    await Promise.all(mapped);
  }

  /**
   * Checks whether or not the given system should run when passed the given options.
   * @param system The system to check for.
   * @param options The options to pass.
   */
  protected shouldRunSystem(system: System, options?: RunOptions): boolean {
    const isRendering: boolean | undefined = options?.isRendering;
    const isRenderSystem: boolean | undefined = (system as YaveSystem)
      .isRenderSystem;

    // TODO: Maybe I should just keep track of renderSystems and systems as two separate arrays so I don't have to check every frame

    // Runs systems according to render system requirements
    // If either is undefined, it will act as if it was not rendering/not a render system
    return (
      (isRendering === true && isRenderSystem === true) ||
      (isRendering !== true && isRenderSystem !== true)
    );
  }
}
