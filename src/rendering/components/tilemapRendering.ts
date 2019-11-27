import PIXI from '../../lib/pixi';
import { PixiRendering } from './pixiRendering';

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

  /**
   * TODO: Create a "tilemap" component which handles the actual tilemap data,
   * then create a system which "renders" the tilemap's data into the tilemapRendering component.
   */
}
