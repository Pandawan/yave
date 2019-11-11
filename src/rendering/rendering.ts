export abstract class AbstractRendering<T> {
  public renderingEngine: T | null = null;

  protected readonly container: HTMLElement;

  /**
   * Create a Rendering Engine.
   * @param containerId The HTML #id of the container to create the rendering engine in.
   */
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (container === null)
      throw new Error(`Could not find an element with id ${containerId}`);
    this.container = container;
  }

  /**
   * Called on initialization of YaveEngine.
   * Use this to implement any rendering engine setup.
   */
  abstract init(): void;

  /**
   * Called after calling all render systems.
   * Use this to actually render the view.
   */
  abstract render(): void;
}
