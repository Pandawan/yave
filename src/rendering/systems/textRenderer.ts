import { YaveRenderingSystem, YaveEntity } from '../../ecs';
import { TextRendering } from '../components/textRendering';
import { Anchor, Position, Rotation, Scale } from '../../base';

export class TextRenderer extends YaveRenderingSystem {
  constructor() {
    super(undefined, [Position, TextRendering]);
  }

  onAddedEntities(...entities: YaveEntity[]): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    for (const entity of entities) {
      const textRendering = entity.components.get(TextRendering);
      if (textRendering.addedToEngine === false)
        this.addToRenderingEngine(textRendering);
    }
  }

  processEntity(entity: YaveEntity): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    const position = entity.components.get(Position);
    const textRendering = entity.components.get(TextRendering);
    // Rotation, Anchor and Scale are not required so they could be undefined
    const rotation = entity.components.get(Rotation) as Rotation | undefined;
    const anchor = entity.components.get(Anchor) as Anchor | undefined;
    const scale = entity.components.get(Scale) as Scale | undefined;

    // Add the sprite to rendering engine if not already done
    if (textRendering.addedToEngine === false)
      this.addToRenderingEngine(textRendering);

    // Update the sprite's position
    textRendering.textObject.position.set(position.x, position.y);
    // Update z index based on z position (See: https://pixijs.download/dev/docs/PIXI.Sprite.html#zIndex)
    textRendering.textObject.zIndex = position.z;

    // Update rotation if applicable
    if (rotation !== undefined) textRendering.textObject.angle = rotation.z;

    // Update anchor if applicable
    if (anchor !== undefined)
      textRendering.textObject.anchor.set(anchor.x, anchor.y);

    // Update scale if applicable
    if (scale !== undefined)
      textRendering.textObject.scale.set(scale.x, scale.y);
  }

  private addToRenderingEngine(textRendering: TextRendering): void {
    this.yaveEngine?.rendering.renderingEngine?.stage.addChild(
      textRendering.textObject
    );
    textRendering.addedToEngine = true;
  }
}
