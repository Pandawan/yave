import PIXI from '../../lib/pixi';
import { PixiRendering } from './pixiRendering';

// TODO: Should this extend PixiRendering like the other components?
export class TilemapRendering extends PixiRendering {
  /**
   * The actual PIXI.tilemap object.
   */
  public tileLayer: PIXI.tilemap.CompositeRectTileLayer;

  /**
   * Whether or not the sprite has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;

  /**
   * The underlying generic PIXI object.
   */
  public get pixiObj(): PIXI.Container {
    return this.tileLayer;
  }

  constructor(textures?: PIXI.Texture[]) {
    super();
    this.tileLayer = new PIXI.tilemap.CompositeRectTileLayer(0, textures);
  }

  // TODO: Add Utility functions to set/get tiles, etc.
}
