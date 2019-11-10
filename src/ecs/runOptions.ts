/**
 * The options to pass to the ECS's run method
 */
export interface RunOptions {
  /**
   * Change in time since last update/frame.
   */
  deltaTime: number;
  /**
   * Whether or not this execution happens on a "render" or "update" tick
   */
  isRendering: boolean;
}
