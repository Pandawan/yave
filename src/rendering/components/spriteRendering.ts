import PIXI from '../../lib/pixi';
import { PixiRendering } from './pixiRendering';

// NOTE: This is named SpriteRendering because "Sprite" name conflicts with pixi.js' Sprite and might be too confusing
export class SpriteRendering extends PixiRendering {
  /**
   * The PIXI.Sprite object.
   */
  public sprite: PIXI.Sprite;

  /**
   * The color (in hex) to apply to the sprite.
   * Note: default is 0xffffff (white)
   */
  public get color(): number {
    return this.sprite.tint;
  }

  public set color(value: number) {
    this.sprite.tint = value;
  }

  /**
   * The origin position of the texture (between 0 and 1).
   * Note: This is different from pivot point.
   */
  public get anchor(): PIXI.ObservablePoint {
    return this.sprite.anchor;
  }

  public set anchor(value: PIXI.ObservablePoint) {
    this.sprite.anchor = value;
  }

  /**
   * The underlying generic PIXI object.
   */
  public get pixiObj(): PIXI.Container {
    return this.sprite;
  }

  constructor(textureURL: string, color?: number, alpha?: number);
  constructor(texture: PIXI.Texture, color?: number, alpha?: number);
  constructor(sprite: PIXI.Sprite, color?: number, alpha?: number);
  constructor(
    sprite: string | PIXI.Sprite | PIXI.Texture,
    color = 0xffffff,
    alpha = 1
  ) {
    super();

    if (sprite instanceof PIXI.Sprite) {
      this.sprite = sprite;
    } else {
      this.sprite = PIXI.Sprite.from(sprite);
    }

    this.color = color;
    this.alpha = alpha;
    this.anchor.set(0.5, 0.5);
  }
}
