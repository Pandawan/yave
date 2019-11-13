import { YaveEntity } from '../../ecs/entity';
import { SpriteRenderer } from './spriteRenderer';
import { Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js';
import { Position, Rotation, Scale } from '../../base';
import { SpriteRendering } from '../components/spriteRendering';

describe('SpriteRenderer', () => {
  let mockEntity: YaveEntity;
  let spriteRenderer: SpriteRenderer;

  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
    mockEntity = new YaveEntity();
    mockEntity.components.add(
      new Position(1, 2, 3),
      new SpriteRendering(PixiTexture.WHITE)
    );

    spriteRenderer = new SpriteRenderer();

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
  });

  describe('onEntityAdded', () => {
    it('should automatically add the sprite to the rendering engine', () => {
      spriteRenderer.onAddedEntities(mockEntity);

      expect(
        spriteRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
      ).toBeCalled();
      expect(mockEntity.components.get(SpriteRendering).addedToEngine).toBe(
        true
      );
    });
  });

  describe('processEntity', () => {
    // When the entity already exists
    it("should automatically add pre-existing entity's sprite to the rendering engine", () => {
      (spriteRenderer as any).processEntity(mockEntity);

      expect(
        spriteRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
      ).toBeCalled();
      expect(mockEntity.components.get(SpriteRendering).addedToEngine).toBe(
        true
      );
    });

    it("should update the sprite's position", () => {
      (spriteRenderer as any).processEntity(mockEntity);

      const pos = mockEntity.components.get(Position);
      const sprite = mockEntity.components.get(SpriteRendering);
      expect(sprite.sprite.position.x).toBe(pos.x);
      expect(sprite.sprite.position.y).toBe(pos.y);
    });

    it("should update the sprite's rotation (when there is one)", () => {
      mockEntity.components.add(new Rotation(45));

      (spriteRenderer as any).processEntity(mockEntity);

      const rot = mockEntity.components.get(Rotation);
      const sprite = mockEntity.components.get(SpriteRendering);

      expect(sprite.sprite.angle).toBe(rot.z);
    });

    it("should update the sprite's scale (when there is one)", () => {
      mockEntity.components.add(new Scale(1, 2));

      (spriteRenderer as any).processEntity(mockEntity);

      const scale = mockEntity.components.get(Scale);
      const sprite = mockEntity.components.get(SpriteRendering);

      expect(sprite.sprite.scale.x).toBe(scale.x);
      expect(sprite.sprite.scale.y).toBe(scale.y);
    });

    it("should update the sprite's color and alpha", () => {
      (spriteRenderer as any).processEntity(mockEntity);

      const sprite = mockEntity.components.get(SpriteRendering);
      expect(sprite.sprite.alpha).toBe(sprite.alpha);
      expect(sprite.sprite.tint).toBe(sprite.color);
    });
  });
});
