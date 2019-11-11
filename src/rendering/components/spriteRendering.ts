import { Component } from '@trixt0r/ecs';
import { Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js';

// NOTE: This is named SpriteRendering because name conflicts with pixi.js' Sprite and might be too confusing
export class SpriteRendering implements Component {
  /**
   * The PIXI.Sprite object.
   */
  public sprite: PixiSprite;
  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;

  constructor(textureURL: string);
  constructor(texture: PixiTexture);
  constructor(sprite: PixiSprite);
  constructor(sprite: string | PixiSprite | PixiTexture) {
    if (sprite instanceof PixiSprite) {
      this.sprite = sprite;
    } else {
      // TODO: Add (option to use) more optimized asset loader from pixi
      this.sprite = PixiSprite.from(sprite);
    }
  }
}
