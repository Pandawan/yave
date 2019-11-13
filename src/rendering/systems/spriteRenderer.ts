import { YaveRenderingSystem, YaveEntity } from '../../ecs';
import { SpriteRendering } from '../components/spriteRendering';
import { Position, Rotation, Scale } from '../../base';

export class SpriteRenderer extends YaveRenderingSystem {
  constructor() {
    super(undefined, [Position, SpriteRendering]);
  }

  onAddedEntities(...entities: YaveEntity[]): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    for (const entity of entities) {
      const spriteRendering = entity.components.get(SpriteRendering);
      if (spriteRendering.addedToEngine === false)
        this.addToRenderingEngine(spriteRendering);
    }
  }

  processEntity(entity: YaveEntity): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    const position = entity.components.get(Position);
    const spriteRendering = entity.components.get(SpriteRendering);
    // Rotation & Scale are not required so they could be undefined
    const rotation = entity.components.get(Rotation) as Rotation | undefined;
    const scale = entity.components.get(Scale) as Scale | undefined;

    // Add the sprite to rendering engine if not already done
    if (spriteRendering.addedToEngine === false)
      this.addToRenderingEngine(spriteRendering);

    // Update the sprite's color & alpha
    spriteRendering.sprite.tint = spriteRendering.color;
    spriteRendering.sprite.alpha = spriteRendering.alpha;
    // Update the sprite's position
    spriteRendering.sprite.position.set(position.x, position.y);
    // Update z index based on z position (See: https://pixijs.download/dev/docs/PIXI.Sprite.html#zIndex)
    spriteRendering.sprite.zIndex = position.z;
    // Update rotation if applicable
    if (rotation !== undefined) spriteRendering.sprite.angle = rotation.z;
    // Update scale if applicable
    if (scale !== undefined) spriteRendering.sprite.scale.set(scale.x, scale.y);
  }

  private addToRenderingEngine(spriteRendering: SpriteRendering): void {
    this.yaveEngine?.rendering.renderingEngine?.stage.addChild(
      spriteRendering.sprite
    );
    spriteRendering.addedToEngine = true;
  }
}
