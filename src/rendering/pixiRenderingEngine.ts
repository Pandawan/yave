import PIXI, { Viewport } from '../lib/pixi';
import { AbstractRendering } from './renderingEngine';

export class PixiRenderingEngine extends AbstractRendering<PIXI.Application> {
  /**
   * Resource Loader for PIXI
   */
  public readonly loader: PIXI.Loader = new PIXI.Loader();

  /**
   * World object in Pixi stage.
   * Make this the parent of all objects within the world.
   */
  public world: Viewport | null = null;

  init(): void {
    // TODO: Might want to switch this to a PIXI.Renderer + PIXI.Container
    this.renderingEngine = new PIXI.Application({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      resizeTo: this.container,
      autoDensity: true,
      /*
       * Retina devices render at twice the pixel size that they advertise, correct that by changing resolution
       * NOTE: This means that you also need to create textures that are upscaled by 2 for retina
       *  (and have @2x somewhere in the path to the image for pixi to auto-set the Texture.resolution to 2)
       *  See: https://github.com/pixijs/pixi.js/issues/621 for more info
       */
      resolution: window.devicePixelRatio,
      /** Don't auto-render, let Yave's game loop handle it */
      autoStart: false,
    });

    this.container.appendChild(this.renderingEngine.view);

    // TODO: I'm not sure I need this viewport, I can probably handle this all myself
    this.world = new Viewport({
      screenWidth: this.container.clientWidth,
      screenHeight: this.container.clientHeight,
      noTicker: true,
      interaction: this.renderingEngine.renderer.plugins.interaction,
    });

    // Tell world to auto-sort by zIndex
    this.world.sortableChildren = true;

    this.renderingEngine.stage.addChild(this.world);

    // Auto-resize renderer & viewport/world whenever the window changes size
    window.addEventListener('resize', () => {
      if (this.renderingEngine !== null) {
        this.renderingEngine.resize();
      }

      if (this.world !== null) {
        this.world.resize(
          this.container.clientWidth,
          this.container.clientHeight
        );
      }
    });
  }

  load(): Promise<void> {
    // Create a promise that returns once the resource loader has finished loading.
    return new Promise(resolve => {
      this.loader.load(() => {
        resolve();
      });
    });
  }

  render(dt: number): void {
    if (this.renderingEngine !== null) {
      if (this.world !== null) {
        this.world.update(dt);
      }
      this.renderingEngine.render();
    }
  }
}
