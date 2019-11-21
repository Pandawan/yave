import { Component } from '@trixt0r/ecs';
import PIXI from '../../lib/pixi';

export abstract class PixiRendering implements Component {
  /**
   * The underlying PIXI object.
   */
  public abstract get pixiObj(): PIXI.Container;

  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;
}
