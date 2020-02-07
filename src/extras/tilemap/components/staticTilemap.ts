import { Component } from '@trixt0r/ecs';
import { Vector } from '@/utils';

// TODO: Spec file

/**
 * Creates a static tilemap where each tile is just an ID for a definition.
 * This component keeps track of a definition of tiles.
 * It represents the map as a 2D array of references to a corresponding tile definition.
 */
export class StaticTilemap<TileId = string> implements Component {
  /**
   * 2D Map of internal tile IDs as references to the definitions.
   * Key is position, Value is tile ID.
   */
  private _tiles: Map<string, TileId>;

  /**
   * 2D Array of [position, tileId] that have been modified.
   * Key is position, Value is tile ID.
   * (Clear this with clearDirty).
   */
  private _dirtyTiles: Map<string, TileId | null>;

  /**
   * 2D Map of internal tile IDs as references to the definitions.
   * Key is position, Value is tile ID.
   * (Use associated functions to modify tiles).
   */
  public get tiles(): ReadonlyMap<string, TileId> {
    return this._tiles;
  }

  /**
   * 2D Map of tile positions that have been modified in the last update.
   * Key is position, Value is tile ID (null for "removed").
   * (Clear this with clearDirty).
   */
  public get dirtyTiles(): ReadonlyMap<string, TileId | null> {
    return this._dirtyTiles;
  }

  /**
   * Whether or not the tilemap has been modified in the last update.
   */
  public get isDirty(): boolean {
    return this._dirtyTiles.size > 0;
  }

  public constructor() {
    this._tiles = new Map();
    this._dirtyTiles = new Map();
  }

  // #region Tile Access

  // TODO: Support z position (multiple layers? idk)

  public getTileAt(position: Vector): TileId | undefined {
    return this._tiles.get(position.toString(true));
  }

  public setTileAt(position: Vector, tileId: TileId | null): void {
    const posStr = position.toString(true);

    // If tileId is undefined, it has been removed
    if (tileId === null) {
      this._tiles.delete(posStr);
      this._dirtyTiles.set(posStr, null);
      return;
    }

    // Set tile & add to list of dirty
    this._tiles.set(posStr, tileId);
    this._dirtyTiles.set(posStr, tileId);
  }

  public removeTileAt(position: Vector): void {
    this.setTileAt(position, null);
  }

  // #endregion

  /**
   * Clear the list of dirty tiles (usually after rendering/processing).
   */
  public clearDirty(): void {
    this._dirtyTiles.clear();
  }
}
