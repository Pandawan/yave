import { RunOptions, YaveRenderingSystem } from '../../ecs';

export class FramerateCounter extends YaveRenderingSystem {
  private textElement: HTMLElement;

  constructor() {
    super();
    this.textElement = document.createElement('span');
    this.textElement.style.position = 'absolute';
    this.textElement.style.top = '0';
    this.textElement.style.right = '0';
    this.textElement.style.padding = '0.5rem';
    this.textElement.style.color = 'white';
    this.textElement.style.background = 'rgba(0,0,0,0.25)';
    this.textElement.style.fontFamily = 'sans-serif';
    document.body.appendChild(this.textElement);
  }

  process(options?: RunOptions): void {
    // TODO: Clean this up so that I don't need all of these in every single system that overrides process
    if (this._engine === null || this._engine === undefined) return;

    // Need deltaTime
    if (options === undefined) return;

    this.textElement.textContent = `FPS ${Math.round(
      (1 / options.deltaTime) * 1000
    )}`;
  }
}
