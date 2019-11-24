import PIXI from '../lib/pixi';
import { AbstractRendering } from './renderingEngine';

export class PixiRenderingEngine extends AbstractRendering<PIXI.Application> {
  /**
   * Resource Loader for PIXI
   */
  public readonly loader: PIXI.Loader = new PIXI.Loader();

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
  }

  load(): Promise<void> {
    // Create a promise that returns once the resource loader has finished loading.
    return new Promise(resolve => {
      this.loader.load(() => {
        resolve();
      });
    });
  }

  render(): void {
    if (this.renderingEngine !== null) {
      this.renderingEngine.render();
    }
  }
}
