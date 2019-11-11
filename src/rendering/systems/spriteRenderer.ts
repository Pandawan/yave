import { YaveRenderingSystem, YaveEntity } from '../../ecs';
import { Position } from '../../base/components/position';
import { SpriteRendering } from '../components/spriteRendering';
import { Rotation } from '../../base/components/rotation';

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
    // Rotation is not required so it could be null
    const rotation = entity.components.get(Rotation) as Rotation | null;

    // Add the sprite to rendering engine if not already done
    if (spriteRendering.addedToEngine === false)
      this.addToRenderingEngine(spriteRendering);

    // Update the sprite's position
    spriteRendering.sprite.position.set(position.x, position.y);
    // Update rotation if applicable
    if (rotation !== undefined && rotation !== null)
      spriteRendering.sprite.angle = rotation.z;
  }

  private addToRenderingEngine(spriteRendering: SpriteRendering): void {
    this.yaveEngine?.rendering.renderingEngine?.stage.addChild(
      spriteRendering.sprite
    );
    spriteRendering.addedToEngine = true;
  }
}
