import { YaveEntityRenderingSystem, YaveEntity } from '../../ecs';
import { Position, Rotation } from '../../base';
import { Camera } from '../components/camera';

/**
 * Rendering System for SpriteRendering and TextRendering component.
 */
export class CameraRenderer extends YaveEntityRenderingSystem {
  constructor() {
    super(undefined, [Camera, Position], undefined);
  }

  process(): void {
    if (this._engine === null || this._engine === undefined) return;

    const entities = (this.aspect !== null && this.aspect !== undefined
      ? this.aspect.entities
      : this._engine.entities.elements) as YaveEntity[];

    // Only keep track of active cameras
    const activeCameraEntities = entities.filter(
      entity => entity.components.get(Camera).active === true
    );

    if (activeCameraEntities.length > 1)
      throw new Error('Cannot have more than one active camera');

    // If there are no cameras, just don't do anything
    if (activeCameraEntities.length === 0) return;

    this.processEntity(activeCameraEntities[0]);
  }

  processEntity(entity: YaveEntity): void {
    if (
      this.yaveEngine === null ||
      this.yaveEngine.rendering.renderingEngine === null
    )
      return;

    const camera = entity.components.get(Camera);
    const position = entity.components.get(Position);
    const rotation = entity.components.get(Rotation) as Rotation | undefined;

    const world = this.yaveEngine.rendering.world;

    // If there's no world/viewport, we don't care
    if (world === null || world === undefined) return;

    // TODO: Maybe follow entity should be a separate system from camera?
    // TODO: Also viewport has a follow property to follow a PixiObject, is that worth it? (probs not)
    // If have an entity to follow, set camera's position to that
    if (camera.followEntity !== null) {
      // Get the entity with followEntity ID
      const entityToFollow = this.yaveEngine.ecs.entities
        .filter(
          (entity: YaveEntity | undefined) => entity?.id === camera.followEntity
        )
        .shift();

      if (entityToFollow === undefined || entityToFollow === null) {
        throw new Error(
          `Could not find entity with ID ${camera.followEntity}.`
        );
      }

      const entityToFollowPosition = entityToFollow.components.get(Position);

      if (
        entityToFollowPosition === undefined ||
        entityToFollowPosition === null
      ) {
        throw new Error(
          `Entity with ID ${camera.followEntity} to follow does not have a Position component.`
        );
      }

      // Set position to be same as entityToFollow
      position.set(
        entityToFollowPosition.x,
        entityToFollowPosition.y,
        // Keep current Z-Index
        position.z
      );
    }

    // Update camera's actual position
    world.moveCenter(position.x, position.y);
    // Update z index based on z position
    world.zIndex = position.z;

    // Update rotation if applicable
    if (rotation !== undefined) {
      world.angle = rotation.z;
      world.pivot.set(rotation.pivot.x, rotation.pivot.y);
    }

    // TODO: I don't need it right now but maybe in the future, add zoom, bounds, etc.
  }
}
