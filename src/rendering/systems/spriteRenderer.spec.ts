import { YaveEntity } from '../../ecs/entity';
import { SpriteRenderer } from './spriteRenderer';
import { Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js';
import { Position } from '../../base';
import { SpriteRendering } from '../components/spriteRendering';

describe('SpriteRenderer', () => {
  let mockEntity: YaveEntity;

  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    mockEntity = new YaveEntity();
    mockEntity.components.add(
      new Position(),
      new SpriteRendering(PixiTexture.WHITE)
    );
  });

  it('should automatically add the sprite to the rendering engine when entity is added', () => {
    const spriteRenderer = new SpriteRenderer();
    (spriteRenderer as any)._yaveEngine = {
      rendering: {
        renderingEngine: {
          stage: {
            addChild: jest.fn((sprite: PixiSprite) => {
              expect(sprite instanceof PixiSprite).toBe(true);
            }),
          },
        },
      },
    };

    spriteRenderer.onAddedEntities(mockEntity);

    expect(
      spriteRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
    ).toBeCalled();
    expect(mockEntity.components.get(SpriteRendering).addedToEngine).toBe(true);
  });

  // When the entity already exists
  it("should automatically add pre-existing entity's sprite to the rendering engine when processed", () => {
    const spriteRenderer = new SpriteRenderer();

    (spriteRenderer as any)._yaveEngine = {
      rendering: {
        renderingEngine: {
          stage: {
            addChild: jest.fn((sprite: PixiSprite) => {
              expect(sprite instanceof PixiSprite).toBe(true);
            }),
          },
        },
      },
    };

    (spriteRenderer as any).processEntity(mockEntity);

    expect(
      spriteRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
    ).toBeCalled();
    expect(mockEntity.components.get(SpriteRendering).addedToEngine).toBe(true);
  });
});
