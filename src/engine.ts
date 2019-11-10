import {
  SignalDispatcher,
  ISignal,
  SimpleEventDispatcher,
  ISimpleEvent,
} from 'strongly-typed-events';
import { Engine as ECS } from '@trixt0r/ecs';

/**
 * The main class for the Yave Engine
 */
export default class YaveEngine {
  /**
   * Current status of the engine.
   */
  private _status: 'stopped' | 'running' | 'paused' = 'stopped';

  /**
   * Time to keep track of delta time.
   * (This is essentially the time since the start of the frame).
   */
  private _time = Date.now();

  private _onInit = new SignalDispatcher();
  private _onStop = new SignalDispatcher();
  private _onTick = new SimpleEventDispatcher<number>();

  /**
   * The Entity Component System engine.
   * TODO: Should this be initialized on init instead of here?
   */
  public ecs: ECS = new ECS();

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
   * Event called before the engine has ticked (with deltaTime).
   */
  public get onTick(): ISimpleEvent<number> {
    return this._onTick.asEvent();
  }

  /**
   * Initialize the engine and start it.
   * This will also call onInit.
   */
  public init(): void {
    if (this._status === 'running' || this._status === 'paused')
      throw new Error('Engine is already running (or paused)');

    this.runLoop();
    this._status = 'running';
    this._onInit.dispatch();
  }

  /**
   * Stop the engine entirely.
   * This will also call onStop.
   */
  public stop(): void {
    if (this._status === 'stopped')
      throw new Error('Engine is already stopped');

    this._onStop.dispatch();
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
   * The actual loop of the engine.
   * This calls the ticking and other update functions.
   */
  private runLoop(): void {
    requestAnimationFrame(() => {
      // Stop the loop if status says to
      if (this.status === 'stopped') return;

      // Calculate deltatime
      const now = Date.now();
      const delta = now - this._time;
      this._time = now;

      // Call update functions
      this.tick(delta);

      // Loop
      this.runLoop();
    });
  }

  /**
   * Update the engine.
   * @param delta Change in time since last tick
   */
  public tick(delta: number): void {
    // Don't update if paused
    if (this.status === 'paused') return;

    this._onTick.dispatch(delta);

    this.ecs.run(delta);
  }
}
