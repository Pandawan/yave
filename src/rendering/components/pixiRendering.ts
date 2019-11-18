import { Component } from '@trixt0r/ecs';
import { Sprite as PixiSprite } from 'pixi.js';

export abstract class PixiRendering implements Component {
  /**
   * The underlying PIXI.Sprite object.
   */
  public abstract get sprite(): PixiSprite;

  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;
}
