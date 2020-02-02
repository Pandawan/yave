import { YaveEntity } from '@/ecs/entity';
import { PixiRenderer } from './pixiRenderer';
import PIXI from '@/lib/pixi';
import { Position, Rotation, Scale } from '@/base';
import { SpriteRendering } from '../components/spriteRendering';
import { TextRendering } from '../components/textRendering';
import { PixiRendering } from '../components/pixiRendering';

describe('PixiRenderer', () => {
  let mockEntity: YaveEntity;
  let pixiRenderer: PixiRenderer;

  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';

    pixiRenderer = new PixiRenderer();

    (pixiRenderer as any)._yaveEngine = {
      rendering: {
        world: {
          addChild: jest.fn(),
        },
      },
    };
  });

  // Test cases to run generic tests (ie which should run for both Sprite & Text)
  const genericCases: [
    typeof SpriteRendering | typeof TextRendering,
    SpriteRendering | TextRendering
  ][] = [
    [SpriteRendering, new SpriteRendering(PIXI.Texture.WHITE)],
    [TextRendering, new TextRendering('Test', 16, 0xffffff)],
  ];

  describe('PixiRendering (Each Subtype)', () => {
    for (const [componentClass, component] of genericCases) {
      describe(componentClass.name, () => {
        // Run tests for both SpriteRendering & TextRendering
        beforeEach(() => {
          mockEntity = new YaveEntity();
          mockEntity.components.add(new Position(1, 2, 3), component);
        });

        describe('onEntityAdded', () => {
          it('should automatically add the sprite to the rendering engine', () => {
            component.addedToEngine = false;
            pixiRenderer.onAddedEntities(mockEntity);

            expect(
              pixiRenderer.yaveEngine?.rendering.world?.addChild
            ).toBeCalled();

            expect(
              mockEntity.components.get<PixiRendering>(componentClass)
                .addedToEngine
            ).toBe(true);
          });
        });

        describe('processEntity', () => {
          // When the entity already exists
          it("should automatically add pre-existing entity's sprite to the rendering engine", () => {
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );
            component.addedToEngine = false;
            (pixiRenderer as any).processEntity(mockEntity);

            expect(
              pixiRenderer.yaveEngine?.rendering.world?.addChild
            ).toBeCalled();
            expect(pixiRendering.addedToEngine).toBe(true);
          });

          it("should update the sprite's position", () => {
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );
            (pixiRenderer as any).processEntity(mockEntity);

            const pos = mockEntity.components.get(Position);
            expect(pixiRendering.pixiObj.position.x).toBe(pos.x);
            expect(pixiRendering.pixiObj.position.y).toBe(pos.y);
          });

          it("should update the sprite's rotation (when there is one)", () => {
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );
            mockEntity.components.add(new Rotation(45));

            (pixiRenderer as any).processEntity(mockEntity);

            const rot = mockEntity.components.get(Rotation);

            expect(pixiRendering.pixiObj.angle).toBe(rot.z);
            expect(pixiRendering.pixiObj.pivot.x).toBe(rot.pivot.x);
            expect(pixiRendering.pixiObj.pivot.y).toBe(rot.pivot.y);
          });

          it("should update the sprite's scale (when there is one)", () => {
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );
            mockEntity.components.add(new Scale(1, 2));

            (pixiRenderer as any).processEntity(mockEntity);

            const scale = mockEntity.components.get(Scale);

            expect(pixiRendering.pixiObj.scale.x).toBe(scale.x);
            expect(pixiRendering.pixiObj.scale.y).toBe(scale.y);
          });
        });
      });
    }
  });

  describe('SpriteRendering', () => {
    beforeEach(() => {
      mockEntity = new YaveEntity();
      mockEntity.components.add(new Position(1, 2, 3));
      mockEntity.components.add(new SpriteRendering(PIXI.Texture.WHITE));
    });

    describe('processEntity', () => {
      it("should update the sprite's color and alpha", () => {
        (pixiRenderer as any).processEntity(mockEntity);

        const sprite = mockEntity.components.get(SpriteRendering);
        expect(sprite.sprite.alpha).toBe(sprite.alpha);
        expect(sprite.sprite.tint).toBe(sprite.color);
      });
    });
  });

  // TODO: Should this be moved to another file
  describe('TextRendering', () => {
    beforeEach(() => {
      mockEntity = new YaveEntity();
      mockEntity.components.add(new Position(1, 2, 3));
      mockEntity.components.add(new TextRendering('Test', 16, 0xffffff));
    });

    describe('processEntity', () => {
      it("should update the sprite's text & style", () => {
        (pixiRenderer as any).processEntity(mockEntity);

        const textRendering = mockEntity.components.get(TextRendering);
        expect(textRendering.textObject.text).toBe(textRendering.text);
        expect(textRendering.textObject.style).toBe(textRendering.style);
      });
    });
  });
});
