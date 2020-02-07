import { YaveEntity, YaveEntityRenderingSystem } from '@/ecs';
import { StaticTilemap } from '../components/staticTilemap';
import { TilemapRendering } from '../components/tilemapRendering';
import { Vector } from '@/utils';

/**
 * Processes tilemaps to be rendered by the TilemapRendering engine.
 * NOTE: This does not do any camera bound checking rendering optimization. (TODO: Maybe later)
 */
export class TilemapProcessor extends YaveEntityRenderingSystem {
  // TODO: Spec file
  constructor() {
    super(undefined, [TilemapRendering], undefined, [StaticTilemap]);
  }

  processEntity(entity: YaveEntity): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    const tilemap = entity.components.get(StaticTilemap);
    const rendering = entity.components.get(TilemapRendering);

    if (tilemap.isDirty === false) return;

    /*
     * NOTE: This might seem inefficient but it is recommended by pixi-tilemap creator
     * https://github.com/pixijs/pixi-tilemap/issues/14
     */
    // Clear the entire tilemap before rendering cycle
    rendering.tileLayer.clear();

    // Loop through every tile and add it to be rendered
    for (const [strPos, tileId] of tilemap.tiles) {
      // TODO: This is very inefficient, string -> Vector b/c can't map over Vector
      const tilePos = Vector.fromString(strPos);
      const tileDef = rendering.tileDefinitions.get(tileId);

      if (
        tileId === undefined ||
        tilePos === undefined ||
        tileDef === undefined
      ) {
        break;
      }
      rendering.tileLayer.addResizeableFrame(
        tileDef,
        tilePos.x * rendering.tileSize,
        tilePos.y * rendering.tileSize,
        // Auto-resize using UV so texture ALWAYS fills the full size
        rendering.tileSize,
        rendering.tileSize
      );
    }

    tilemap.clearDirty();
  }
}
