import {
  SignalDispatcher,
  ISignal,
  SimpleEventDispatcher,
  ISimpleEvent,
} from 'strongly-typed-events';
import { YaveECS, RunOptions } from './ecs';
import { PixiRendering } from './rendering/pixiRendering';

/**
 * The main class for the Yave Engine.
 */
export class YaveEngine {
  /**
   * Current status of the engine.
   */
  private _status: 'stopped' | 'running' | 'paused' = 'stopped';

  /**
   * ID of the requestAnimationFrame's callback.
   * Used to stop the main loop.
   */
  private _frameId: number | undefined = undefined;
  /**
   * Last time that the main loop executed.
   */
  private _lastTime = 0;
  /**
   * How long (in ms) has it been since the last update was executed.
   */
  private _accumulatedTime = 0;

  /* Events */
  private _onInit = new SignalDispatcher();
  private _onStop = new SignalDispatcher();
  // TODO: Should this use RunOptions instead of number (deltaTime)?
  private _onUpdate = new SimpleEventDispatcher<number>();
  // TODO: Should this use RunOptions instead of number (deltaTime)?
  private _onRender = new SimpleEventDispatcher<number>();

  /**
   * The Entity Component System engine.
   */
  public ecs: YaveECS;

  /**
   * The Rendering engine.
   *
   * TODO: Find a way to make this generic in a clean way.
   * I tried with YaveEngine<RenderingEngine extends AbstractRendering<any> = PixiRendering>
   * but you also have to pass the object (or constructor) for PixiRendering to YaveEngine's constructor, which is ugly.
   */
  public rendering: PixiRendering;

  /**
   * How long (in ms) to wait between updates.
   */
  public timeStep = 33;

  constructor(containerId = 'game') {
    // Important sub-engines are setup here
    this.ecs = new YaveECS(this);
    this.rendering = new PixiRendering(containerId);
  }

  /**
   * Get the engine's current status.
   */
  public get status(): 'stopped' | 'running' | 'paused' {
    return this._status;
  }

  /**
   * Event called after the engine has been initialized.
   */
  public get onInit(): ISignal {
    return this._onInit.asEvent();
  }

  /**
   * Event called before the engine is stopped.
   */
  public get onStop(): ISignal {
    return this._onStop.asEvent();
  }

  /**
   * Event called before the engine has updated (with deltaTime).
   */
  public get onUpdate(): ISimpleEvent<number> {
    return this._onUpdate.asEvent();
  }

  /**
   * Event called before the engine has rendered (with deltaTime).
   */
  public get onRender(): ISimpleEvent<number> {
    return this._onRender.asEvent();
  }

  /**
   * Initialize the engine and start it.
   * This will also call onInit.
   */
  public init(): void {
    if (this._status === 'running' || this._status === 'paused')
      throw new Error('Engine is already running (or paused)');

    this._status = 'running';
    // Initialize the rendering engine
    this.rendering.init();
    // Start the game loop
    this.frame(performance.now());
    this._onInit.dispatch();
    // TODO: Find a way to blocking async load the pixi sprites. Perhaps some sort of renderingEngine implementation which has async events that are all called and awaited for.
  }

  /**
   * Stop the engine entirely.
   * This will also call onStop.
   */
  public stop(): void {
    if (this._status === 'stopped')
      throw new Error('Engine is already stopped');

    this._onStop.dispatch();
    if (this._frameId !== undefined) {
      // Stop the main loop entirely
      cancelAnimationFrame(this._frameId);
      this._frameId = undefined;
    }
    this._status = 'stopped';
  }

  /**
   * Set the engine's pause status.
   * @param paused Whether or not to pause the engine
   */
  public setPaused(paused: boolean): void {
    if (this._status === 'stopped')
      throw new Error('Could not set paused status, Engine is stopped');

    this._status = paused === true ? 'paused' : 'running';
  }

  /**
   * The engine's main loop.
   * Executes `update()` every `timeStep` and `render()` every browser animation frame.
   * @param _time How long the engine has been running.
   */
  private frame(_time: number): void {
    // Stop the loop if status says to
    if (this.status === 'stopped') return;

    const currentTime = performance.now();
    let deltaTime = Math.min(1000, currentTime - this._lastTime);
    // TODO: Is skipping after missing 10 updates appropriate?
    // If missed too many updates, skip all of them to catch up
    // (usually happens when process has slept or CPU can't keep up)
    if (deltaTime > this.timeStep * 10) deltaTime = this.timeStep;

    // Keep track of how long it has been since the last update
    this._accumulatedTime += deltaTime;
    this._lastTime = currentTime;

    // If it has been more than {timeStep} since the last update, update as many times as possible to catch up
    while (this._accumulatedTime >= this.timeStep) {
      // this.time += this.step // This keeps track of how long the frame loop has been running
      this._accumulatedTime -= this.timeStep;
      this.update(this.timeStep);
    }

    // Render as often as rAF calls
    this.render(deltaTime);
    this._frameId = requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * Update the engine's non-rendering systems.
   * @param delta Change in time since last update
   */
  public update(delta: number): void {
    // Don't update if paused
    if (this.status === 'paused') return;

    const runOptions: RunOptions = {
      isRendering: false,
      deltaTime: delta,
    };

    this._onUpdate.dispatch(delta);

    // Run all systems
    this.ecs.run(runOptions);
  }

  /**
   * Update the engine's rendering systems.
   * @param delta Change in time since last render
   */
  public render(delta: number): void {
    // Don't update if paused
    if (this.status === 'paused') return;

    const runOptions: RunOptions = {
      isRendering: true,
      deltaTime: delta,
    };

    this._onRender.dispatch(delta);

    // Run all rendering systems
    this.ecs.run(runOptions);

    // Render the view with rendering engine
    this.rendering.render();
  }
}
