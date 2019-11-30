import { ComponentClass } from '@trixt0r/ecs';
import { YaveEntityRenderingSystem, YaveEntity } from '../../ecs';
import { SpriteRendering } from '../components/spriteRendering';
import { PixiRendering } from '../components/pixiRendering';
import { TextRendering } from '../components/textRendering';
import { TilemapRendering } from '../components/tilemapRendering';
import { Position, Rotation, Scale } from '../../base';

const supportedRenderingComponents: ComponentClass<PixiRendering>[] = [
  SpriteRendering,
  TextRendering,
  TilemapRendering,
];

/**
 * Rendering System for SpriteRendering and TextRendering component.
 */
export class PixiRenderer extends YaveEntityRenderingSystem {
  constructor() {
    super(undefined, [Position], undefined, supportedRenderingComponents);
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
      // Rotation, Pivot and Scale are not required so they could be undefined
      const rotation = entity.components.get(Rotation) as Rotation | undefined;
      const scale = entity.components.get(Scale) as Scale | undefined;

      // Add the object to rendering engine if not already done
      if (pixiRendering.addedToEngine === false)
        this.addToRenderingEngine(pixiRendering);

      // Update the pixiObj's position
      pixiRendering.pixiObj.position.set(position.x, position.y);
      // Update z index based on z position (See: https://pixijs.download/dev/docs/PIXI.Sprite.html#zIndex)
      pixiRendering.pixiObj.zIndex = position.z;

      // Update rotation if applicable
      if (rotation !== undefined) {
        pixiRendering.pixiObj.angle = rotation.z;
        // TODO: Right now, pivot is from 0 to texture size, might want to set it from 0 to 1 by doing pivot * size
        // TODO: Scale should be the same for all objects. An object with scale 1 should be the exact same size as another even with different texture sizes
        pixiRendering.pixiObj.pivot.set(rotation.pivot.x, rotation.pivot.y);
      }

      // Update scale if applicable
      if (scale !== undefined)
        pixiRendering.pixiObj.scale.set(scale.x, scale.y);
    }
  }

  private getPixiRenderingComponents(entity: YaveEntity): PixiRendering[] {
    return supportedRenderingComponents
      .map(componentClass => entity.components.get(componentClass))
      .filter(component => component !== undefined && component !== null);
  }

  private addToRenderingEngine(pixiRendering: PixiRendering): void {
    this.yaveEngine?.rendering.world?.addChild(pixiRendering.pixiObj);
    pixiRendering.addedToEngine = true;
  }
}
