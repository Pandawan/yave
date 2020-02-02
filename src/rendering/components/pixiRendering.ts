import { Component } from '@trixt0r/ecs';
import PIXI from '@/lib/pixi';

export abstract class PixiRendering implements Component {
  /**
   * The underlying PIXI object.
   */
  public abstract get pixiObj(): PIXI.Container;

  /**
   * The transparency of the object (from 0 to 1);
   */
  public get alpha(): number {
    return this.pixiObj.alpha;
  }

  public set alpha(value: number) {
    this.pixiObj.alpha = value;
  }

  /**
   * The width (in pixels) of the object.
   */
  public get width(): number {
    return this.pixiObj.width;
  }
  /**
   * The height (in pixels) of the object.
   */
  public get height(): number {
    return this.pixiObj.width;
  }

  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;
}
