import { YaveEntity } from '../../ecs/entity';
import { Position, Rotation } from '../../base';
import { CameraRenderer } from './cameraRenderer';
import { Camera } from '../components/camera';

describe('CameraRenderer', () => {
  let mockActiveCameraEntity: YaveEntity;
  let mockInactiveCameraEntity: YaveEntity;
  let cameraRenderer: CameraRenderer;

  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';

    mockActiveCameraEntity = new YaveEntity();
    mockActiveCameraEntity.components.add(
      new Position(1, 2, 3),
      new Rotation(45),
      new Camera(true)
    );

    mockInactiveCameraEntity = new YaveEntity();
    mockInactiveCameraEntity.components.add(
      new Position(1, 2, 3),
      new Rotation(45),
      new Camera(false)
    );

    cameraRenderer = new CameraRenderer();

    (cameraRenderer as any)._yaveEngine = {
      ecs: {
        entities: [mockActiveCameraEntity, mockInactiveCameraEntity],
      },
      rendering: {
        world: {
          addChild: jest.fn(),
          moveCenter: jest.fn(),
          zIndex: 0,
          angle: 0,
          pivot: {
            set: jest.fn(),
          },
        },
      },
    };
  });

  describe('choosing camera', () => {
    beforeEach(() => {
      (cameraRenderer as any)._engine = {};
    });

    it('should only process the active camera', () => {
      (cameraRenderer as any).aspect = {
        entities: cameraRenderer.yaveEngine?.ecs.entities,
      };
      (cameraRenderer as any).processEntity = jest.fn();
      cameraRenderer.process();
      // Make sure it called the active camera
      expect(cameraRenderer.processEntity).toBeCalledWith(
        mockActiveCameraEntity
      );
      // Make sure only one camera is processed
      expect(cameraRenderer.processEntity).toBeCalledTimes(1);
    });

    it('should throw when there are more than one active cameras', () => {
      mockInactiveCameraEntity.components.get(Camera).active = true;
      (cameraRenderer as any).aspect = {
        entities: [mockActiveCameraEntity, mockInactiveCameraEntity],
      };
      expect(() => cameraRenderer.process()).toThrow();
    });
  });

  it("should update the viewport/world's position and zIndex", () => {
    cameraRenderer.processEntity(mockActiveCameraEntity);

    const pos = mockActiveCameraEntity.components.get(Position);

    const world = cameraRenderer.yaveEngine?.rendering.world;

    expect(world?.moveCenter).toBeCalledWith(pos.x, pos.y);
    expect(world?.zIndex).toBe(pos.z);
  });

  it("should update the viewport/world's rotation and pivot", () => {
    cameraRenderer.processEntity(mockActiveCameraEntity);

    const rot = mockActiveCameraEntity.components.get(Rotation);

    const world = cameraRenderer.yaveEngine?.rendering.world;

    expect(world?.angle).toBe(rot.z);
    expect(world?.pivot.set).toBeCalledWith(rot.pivot.x, rot.pivot.y);
  });

  describe('follow entity', () => {
    it("should update the position component with the entity to follow's position", () => {
      mockActiveCameraEntity.components.get(Camera).followEntity =
        mockInactiveCameraEntity.id;

      const pos = mockActiveCameraEntity.components.get(Position);
      (pos as any).set = jest.fn();

      const targetPos = mockInactiveCameraEntity.components.get(Position);

      cameraRenderer.processEntity(mockActiveCameraEntity);

      expect(pos.set).toBeCalledWith(targetPos.x, targetPos.y, pos.z);
    });

    it('should throw if the entity to follow does not exist', () => {
      mockActiveCameraEntity.components.get(Camera).followEntity =
        'IMPOSSIBLE ID';

      expect(() =>
        cameraRenderer.processEntity(mockActiveCameraEntity)
      ).toThrow();
    });

    it('should throw if the entity to follow does not have a position component', () => {
      mockActiveCameraEntity.components.get(Camera).followEntity =
        mockInactiveCameraEntity.id;

      // Remove position component
      mockInactiveCameraEntity.components.remove(
        mockInactiveCameraEntity.components.get(Position)
      );
      expect(() =>
        cameraRenderer.processEntity(mockActiveCameraEntity)
      ).toThrow();
    });
  });
});
