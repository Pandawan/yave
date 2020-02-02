import { Component } from '@trixt0r/ecs';
import PIXI from '@/lib/pixi';
import { Vector } from '@/utils';

// TODO: Spec file

type TileDefinition = PIXI.Texture | string;

type TileId = string;

/**
 * Creates a static tilemap where each tile is just an ID for a definition.
 * This component keeps track of a definition of tiles.
 * It represents the map as a 2D array of references to a corresponding tile definition.
 */
export class StaticTilemap implements Component {
  /**
   * Definition of each tile by ID.
   * Key is tile ID, Value is tile definition.
   */
  private _tileDefinitions: Map<TileId, TileDefinition>; // TODO: Maybe tileDefinitions should be on tilemapRendering?

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

  /**
   * Definition of each tile.
   * Key is tile ID, Value is tile definition.
   * (Use associated functions to modify this registry of definitions).
   */
  public get tileDefinitions(): ReadonlyMap<TileId, TileDefinition> {
    return this._tileDefinitions;
  }

  public constructor() {
    this._tileDefinitions = new Map();
    this._tiles = new Map();
    this._dirtyTiles = new Map();
  }

  // #region Tile Definition

  /**
   * Registers the given tile definition, allowing this tile type to be used.
   * @param tileId The identifier to refer to this tile defintion. (Can be a tile name, or other).
   * @param tileDefinition The tile definition to register.
   * @returns The tile ID used for the tile.
   */
  public registerTile(tileId: TileId, tileDefinition: TileDefinition): TileId {
    if (tileId !== undefined && this._tileDefinitions.has(tileId) === true) {
      throw new Error(`Tile definition with id ${tileId} already exists.`);
    }
    this._tileDefinitions.set(tileId, tileDefinition);
    return tileId;
  }

  /**
   * Removes the given tile definition from the registry.
   * @param tileId The identifier of the tile definition to remove.
   * @param clearTiles Whether or not to clear all the tiles with the given tileId.
   */
  public unregisterTile(tileId: TileId, clearTiles?: boolean): void {
    this._tileDefinitions.delete(tileId);

    if (clearTiles === true) {
      for (const [tPos, tId] of this._tiles) {
        if (tId === tileId) {
          this._tiles.delete(tPos);
          this._dirtyTiles.set(tPos, null);
        }
      }
    }
  }

  // #endregion Tile Definition

  // #region Tile Access

  // TODO: Support z position (multiple layers? idk)

  public getTileAt(position: Vector): TileDefinition | undefined {
    const tileId = this.getTileIdAt(position);
    if (tileId === undefined) return undefined;
    return this._tileDefinitions.get(tileId);
  }

  public getTileIdAt(position: Vector): TileId | undefined {
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
