import { Application as PixiApplication } from 'pixi.js';
import { AbstractRendering } from './rendering';

export class PixiRendering extends AbstractRendering<PixiApplication> {
  init(): void {
    this.renderingEngine = new PixiApplication({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      resizeTo: this.container,
      autoDensity: true,
      /** Don't auto-render, let Yave's game loop handle it */
      autoStart: false,
    });

    this.container.appendChild(this.renderingEngine.view);
  }

  render(): void {
    if (this.renderingEngine !== null) {
      this.renderingEngine.render();
    }
  }
}
