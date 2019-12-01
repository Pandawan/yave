import {
  ComponentClass,
  Component,
  AspectListener,
  Aspect,
  Engine,
} from '@trixt0r/ecs';
import { YaveSystem } from './system';
import { RunOptions } from './runOptions';
import { YaveEntity } from './entity';

type CompClass = ComponentClass<Component>;

/**
 * ECS System which processes each entity with optional filtering.
 */
export abstract class YaveEntitySystem extends YaveSystem
  implements AspectListener {
  /**
   * The optional aspect, if any.
   *
   * @protected
   * @type {(Aspect | null)}
   */
  protected aspect: Aspect | null = null;

  /**
   * Creates an instance of YaveEntitySystem.
   *
   * @param priority The priority of this system. The lower the value the earlier it will process.
   * @param all Optional component types which should all match.
   * @param exclude Optional component types which should not match.
   * @param one Optional component types of which at least one should match.
   */
  constructor(
    public priority: number = 0,
    protected all?: CompClass[],
    protected exclude?: CompClass[],
    protected one?: CompClass[]
  ) {
    super(priority);
  }

  /** @inheritdoc */
  onAddedToEngine(engine: Engine): void {
    this.aspect = Aspect.for(engine, this.all, this.exclude, this.one);
    this.aspect.addListener(this);
  }

  /** @inheritdoc */
  onRemovedFromEngine(): void {
    if (this.aspect === null || this.aspect === undefined) return;
    this.aspect.removeListener(this);
    this.aspect.detach();
  }

  /**
   * Called if new entities got added to the system.
   *
   * @param entities
   */
  onAddedEntities?(...entities: YaveEntity[]): void;

  /**
   * Called if existing entities got removed from the system.
   *
   * @param entities
   */
  onRemovedEntities?(...entities: YaveEntity[]): void;

  /**
   * Called if the entities got cleared.
   */
  onClearedEntities?(): void;

  /**
   * Called if the entities got sorted.
   */
  onSortedEntities?(): void;

  /**
   * Gets called if new components got added to the given entity.
   *
   * @param entity
   * @param components
   */
  onAddedComponents?(entity: YaveEntity, ...components: Component[]): void;

  /**
   * Gets called if components got removed from the given entity.
   *
   * @param entity
   * @param components
   */
  onRemovedComponents?(entity: YaveEntity, ...components: Component[]): void;

  /**
   * Gets called if the components of the given entity got cleared.
   *
   * @param entity
   */
  onClearedComponents?(entity: YaveEntity): void;

  /**
   * Gets called if the components of the given entity got sorted.
   *
   * @param entity
   */
  onSortedComponents?(entity: YaveEntity): void;

  /** @inheritdoc */
  process(options?: RunOptions): void {
    if (this._engine === null || this._engine === undefined) return;

    const entities =
      this.aspect !== null && this.aspect !== undefined
        ? this.aspect.entities
        : this._engine.entities.elements;

    for (let i = 0, l = entities.length; i < l; i++) {
      this.processEntity(
        entities[i] as YaveEntity,
        options,
        i,
        entities as YaveEntity[]
      );
    }
  }

  /**
   * Processes the given entity.
   *
   * @abstract
   * @param entity The current entity being processed
   * @param options The options passed to the system from ECS.
   * @param index The index of that entity in the entities list.
   * @param entities The list of entities from which the entity was taken.
   */
  abstract processEntity(
    entity: YaveEntity,
    options?: RunOptions,
    index?: number,
    entities?: YaveEntity[]
  ): void;
}

/**
 * ECS Rendering System which processes each entity with an optional filtering.
 */
export abstract class YaveEntityRenderingSystem extends YaveEntitySystem {
  /** @inheritdoc */
  public readonly isRenderSystem = true;
}
