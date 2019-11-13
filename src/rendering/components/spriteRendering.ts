import { Component } from '@trixt0r/ecs';
import { Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js';

// NOTE: This is named SpriteRendering because name conflicts with pixi.js' Sprite and might be too confusing
export class SpriteRendering implements Component {
  /**
   * The PIXI.Sprite object.
   */
  public sprite: PixiSprite;

  /**
   * The color (in hex) to apply to the sprite.
   * Note: default is 0xffffff (white)
   */
  public color: number;

  /**
   * The transparency of the sprite (from 0 to 1);
   */
  public alpha: number;

  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;

  constructor(textureURL: string, color?: number, alpha?: number);
  constructor(texture: PixiTexture, color?: number, alpha?: number);
  constructor(sprite: PixiSprite, color?: number, alpha?: number);
  constructor(
    sprite: string | PixiSprite | PixiTexture,
    color = 0xffffff,
    alpha = 1
  ) {
    if (sprite instanceof PixiSprite) {
      this.sprite = sprite;
    } else {
      // TODO: Add (option to use) more optimized asset loader from pixi
      this.sprite = PixiSprite.from(sprite);
    }

    this.color = color;
    this.alpha = alpha;
  }
}