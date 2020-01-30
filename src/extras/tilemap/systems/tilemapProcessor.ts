import { YaveEntity, YaveEntityRenderingSystem } from '../../../ecs';
import { StaticTilemap } from '../components/staticTilemap';
import { TilemapRendering } from '../components/tilemapRendering';
import { Vector } from '../../../utils';

// TODO: Maybe merge TilemapRendering & StaticTilemap into one component (it doesn't make much sense for them to be separate)

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
      const tileDef = tilemap.tileDefinitions.get(tileId);

      if (
        tileId === undefined ||
        tilePos === undefined ||
        tileDef === undefined
      ) {
        break;
      }
      rendering.tileLayer.addResizeableFrame(
        tileDef,
        /**
         * TODO: Make it so it resizes the texture when size is bigger than texture's size
         * (this might be tricky because texture doesn't handle sizing, Sprite does)
         * SEE: CompositeRectTileLayer.addRect, which seems to be equivalent but with greater control
         * https://github.com/pixijs/pixi-tilemap/blob/master/src/CompositeRectTileLayer.ts#L60
         *
         * NOTE: This could be done by adding "UV" options
         */
        tilePos.x * rendering.tileSize,
        tilePos.y * rendering.tileSize,
        rendering.tileSize,
        rendering.tileSize
      );
    }

    tilemap.clearDirty();
  }
}
