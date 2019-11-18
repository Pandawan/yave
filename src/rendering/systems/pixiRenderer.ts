import { YaveRenderingSystem, YaveEntity } from '../../ecs';
import { SpriteRendering } from '../components/spriteRendering';
import { PixiRendering } from '../components/pixiRendering';
import { TextRendering } from '../components/textRendering';
import { Anchor, Position, Rotation, Scale } from '../../base';

/**
 * Rendering System for SpriteRendering and TextRendering component.
 */
export class PixiRenderer extends YaveRenderingSystem {
  constructor() {
    super(undefined, [Position], undefined, [SpriteRendering, TextRendering]);
  }

  onAddedEntities(...entities: YaveEntity[]): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    for (const entity of entities) {
      const pixiRenderingComponents = this.getPixiRenderingComponents(entity);

      if (pixiRenderingComponents.length === 0)
        throw new Error(
          'Tried executing PixiRenderer system on entity without a PixiRendering component'
        );

      for (const pixiRendering of pixiRenderingComponents) {
        if (
          pixiRendering !== undefined &&
          pixiRendering.addedToEngine === false
        )
          this.addToRenderingEngine(pixiRendering);
      }
    }
  }

  processEntity(entity: YaveEntity): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    const pixiRenderingComponents = this.getPixiRenderingComponents(entity);

    if (pixiRenderingComponents.length === 0)
      throw new Error(
        'Tried executing PixiRenderer system on entity without a PixiRendering component'
      );

    for (const pixiRendering of pixiRenderingComponents) {
      const position = entity.components.get(Position);
      // Rotation, Anchor and Scale are not required so they could be undefined
      const rotation = entity.components.get(Rotation) as Rotation | undefined;
      const anchor = entity.components.get(Anchor) as Anchor | undefined;
      const scale = entity.components.get(Scale) as Scale | undefined;

      // Add the object to rendering engine if not already done
      if (pixiRendering.addedToEngine === false)
        this.addToRenderingEngine(pixiRendering);

      // Update the sprite's position
      pixiRendering.sprite.position.set(position.x, position.y);
      // Update z index based on z position (See: https://pixijs.download/dev/docs/PIXI.Sprite.html#zIndex)
      pixiRendering.sprite.zIndex = position.z;

      // Update rotation if applicable
      if (rotation !== undefined) pixiRendering.sprite.angle = rotation.z;

      // Update anchor if applicable
      if (anchor !== undefined)
        pixiRendering.sprite.anchor.set(anchor.x, anchor.y);

      // Update scale if applicable
      if (scale !== undefined) pixiRendering.sprite.scale.set(scale.x, scale.y);
    }
  }

  private getPixiRenderingComponents(entity: YaveEntity): PixiRendering[] {
    return [
      entity.components.get(SpriteRendering),
      entity.components.get(TextRendering),
    ].filter(component => component !== undefined && component !== null);
  }

  private addToRenderingEngine(pixiRendering: PixiRendering): void {
    this.yaveEngine?.rendering.renderingEngine?.stage.addChild(
      pixiRendering.sprite
    );
    pixiRendering.addedToEngine = true;
  }
}
