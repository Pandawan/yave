import { YaveEntity } from '../../ecs/entity';
import { PixiRenderer } from './pixiRenderer';
import PIXI from '../../lib/pixi';
import { Anchor, Position, Rotation, Scale } from '../../base';
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
        renderingEngine: {
          stage: {
            addChild: jest.fn(),
          },
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
          mockEntity.components.add(new Position(1, 2, 3));
          mockEntity.components.add(component);
        });

        describe('onEntityAdded', () => {
          it('should automatically add the sprite to the rendering engine', () => {
            component.addedToEngine = false;
            pixiRenderer.onAddedEntities(mockEntity);

            expect(
              pixiRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
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
            component.addedToEngine = false;
            (pixiRenderer as any).processEntity(mockEntity);

            expect(
              pixiRenderer.yaveEngine?.rendering.renderingEngine?.stage.addChild
            ).toBeCalled();
            expect(
              mockEntity.components.get<PixiRendering>(componentClass)
                .addedToEngine
            ).toBe(true);
          });

          it("should update the sprite's position", () => {
            (pixiRenderer as any).processEntity(mockEntity);

            const pos = mockEntity.components.get(Position);
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );
            expect(pixiRendering.sprite.position.x).toBe(pos.x);
            expect(pixiRendering.sprite.position.y).toBe(pos.y);
          });

          it("should update the sprite's rotation (when there is one)", () => {
            mockEntity.components.add(new Rotation(45));

            (pixiRenderer as any).processEntity(mockEntity);

            const rot = mockEntity.components.get(Rotation);
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );

            expect(pixiRendering.sprite.angle).toBe(rot.z);
          });

          it("should update the sprite's scale (when there is one)", () => {
            mockEntity.components.add(new Scale(1, 2));

            (pixiRenderer as any).processEntity(mockEntity);

            const scale = mockEntity.components.get(Scale);
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );

            expect(pixiRendering.sprite.scale.x).toBe(scale.x);
            expect(pixiRendering.sprite.scale.y).toBe(scale.y);
          });

          it("should update the sprite's anchor (when there is one)", () => {
            mockEntity.components.add(new Anchor(0.25, 0.75));

            (pixiRenderer as any).processEntity(mockEntity);

            const anchor = mockEntity.components.get(Anchor);
            const pixiRendering = mockEntity.components.get<PixiRendering>(
              componentClass
            );

            expect(pixiRendering.sprite.anchor.x).toBe(anchor.x);
            expect(pixiRendering.sprite.anchor.y).toBe(anchor.y);
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
