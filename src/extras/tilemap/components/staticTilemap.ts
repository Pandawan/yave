import { Component } from '@trixt0r/ecs';
import PIXI from '../../../lib/pixi';
import { Vector } from '../../../utils';

interface TileDefinition {
  /**
   * The texture or path to the texture to render this tile as.
   */
  texture: PIXI.Texture | string;
  /**
   * The size of the tile in pixels.
   */
  size: Vector;
}

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
  private _tileDefinitions: Map<string, TileDefinition>;

  /**
   * 2D Map of internal tile IDs as references to the definitions.
   * Key is position, Value is tile ID.
   */
  private _tiles: Map<string, string>;

  /**
   * 2D Array of [position, tileId] that have been modified.
   * Key is position, Value is tile ID.
   * (Clear this with clearDirty).
   */
  private _dirtyTiles: Set<[string, string | undefined]>;

  /**
   * 2D Map of internal tile IDs as references to the definitions.
   * Key is position, Value is tile ID.
   * (Use associated functions to modify tiles).
   */
  public get tiles(): ReadonlyMap<string, string> {
    return this._tiles;
  }

  /**
   * 2D Array of tile positions that have been modified in the last (current) system cycle.
   * Key is position, Value is tile ID.
   * (Clear this with clearDirty).
   */
  public get dirtyTiles(): ReadonlySet<[string, string | undefined]> {
    return this._dirtyTiles;
  }

  /**
   * Definition of each tile.
   * Key is tile ID, Value is tile definition.
   * (Use associated functions to modify this registry of definitions).
   */
  public get tileDefinitions(): ReadonlyMap<string, TileDefinition> {
    return this._tileDefinitions;
  }

  public constructor() {
    this._tileDefinitions = new Map();
    this._tiles = new Map();
    this._dirtyTiles = new Set();
  }

  // #region Tile Definition

  /**
   * Registers the given tile definition, allowing this tile type to be used.
   * @param tileId The identifier to refer to this tile defintion. (Can be a tile name, or other).
   * @param tileDefinition The tile definition to register.
   * @returns The tile ID used for the tile.
   */
  public registerTile(tileId: string, tileDefinition: TileDefinition): string {
    if (tileId !== undefined && this._tileDefinitions.has(tileId) === true) {
      throw new Error(`Tile definition with id ${tileId} already exists.`);
    }
    this._tileDefinitions.set(tileId, tileDefinition);
    return tileId;
  }

  /**
   * Removes the given tile definition from the registry.
   * @param tileId The identifier of the tile definition to remove.
   */
  public unregisterTile(tileId: string): void;
  public unregisterTile(tileId: string): void {
    // TODO: Cleaning the map whenever it encounters an invalid tileID (perhaps in a system?) (or maybe just render empty?)
    this._tileDefinitions.delete(tileId);
  }

  // #endregion Tile Definition

  // #region Tile Access

  public getTileAt(position: Vector): TileDefinition | undefined {
    const tileId = this.getTileIdAt(position);
    if (tileId === undefined) return undefined;
    return this._tileDefinitions.get(tileId);
  }

  public getTileIdAt(position: Vector): string | undefined {
    return this._tiles.get(position.toString());
  }

  public setTileAt(position: Vector, tileId: string | undefined): void {
    const posStr = position.toString();

    if (tileId === undefined) {
      this._tiles.delete(posStr);
      this._dirtyTiles.add([posStr, tileId]);
      return;
    }

    // Set tile & add to list of dirty
    this._tiles.set(posStr, tileId);
    this._dirtyTiles.add([posStr, tileId]);
  }

  // #endregion

  /**
   * Clear the list of dirty tiles (usually after rendering/processing).
   */
  public clearDirty(): void {
    this._dirtyTiles.clear();
  }
}
