/**
 * TODO: Dynamic Tilemap (later when I have time)
 *
 * This is a tilemap similar to StaticTilemap, but instead of mapping position to TileDefinition,
 * it maps position to entityId. Each tile is an entity but is rendered through the TilemapProcessor like with a StaticTilemap.
 *
 * The tileEntities have a "Tile" component with which texture to render.
 * This allows for tileEntities to have custom components and therefore custom logic.
 *
 * The TilemapProcessor would work the same way, looping over the tiles references in the DynamicTilemap's Map<position, id>.
 * This means that any tile that is not referenced in a DynamicTilemap isn't rendered.
 */
