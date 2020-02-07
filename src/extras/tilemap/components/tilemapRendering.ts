import PIXI from '@/lib/pixi';
import { PixiRendering } from '@/rendering/components/pixiRendering';
import { Vector } from '@/utils';

type TileDefinition = PIXI.Texture | string;

export class TilemapRendering<TileId = string> extends PixiRendering {
  /**
   * Definition of each tile.
   * Key is tile ID, Value is tile definition.
   */
  public tileDefinitions: Map<TileId, TileDefinition>;

  /**
   * The actual PIXI.tilemap object.
   */
  public tileLayer: PIXI.tilemap.CompositeRectTileLayer;

  /**
   * Size to render tiles as (in pixels).
   */
  public tileSize: number;

  /**
   * The underlying generic PIXI object.
   */
  public get pixiObj(): PIXI.Container {
    return this.tileLayer;
  }

  constructor(tileSize = 32, textures?: PIXI.Texture[]) {
    super();
    this.tileDefinitions = new Map();
    this.tileLayer = new PIXI.tilemap.CompositeRectTileLayer(0, textures);
    this.tileSize = tileSize;
  }

  // #region Position Utilities

  /**
   * Converts the given world position to a tilemap position.
   * @param worldPosition A position in world coordinates.
   */
  public worldToTilemapPosition(worldPosition: Vector): Vector {
    // TODO: Spec
    const tilemapPosition = worldPosition
      .clone()
      .map(v => v / this.tileSize)
      .floor();

    // Don't want to affect z
    tilemapPosition.z = worldPosition.z;
    return tilemapPosition;
  }

  /**
   * Converts the given tilemap position to a world position.
   * @param tilemapPosition A position in tilemap coordinates.
   * @param offset An vector of values between 0 and 1 to specify
   * the offset of the final position from the corner.
   */
  public tilemapToWorldPosition(
    tilemapPosition: Vector,
    offset = new Vector(0, 0)
  ): Vector {
    // TODO: Spec
    return tilemapPosition
      .clone()
      .map(v => v * this.tileSize)
      .add(offset.map(v => v * this.tileSize));
  }

  // #endregion
}
