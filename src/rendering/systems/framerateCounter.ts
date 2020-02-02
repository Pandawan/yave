import { RunOptions, YaveRenderingSystem } from '@/ecs';

// TODO: Spec.ts
export class FramerateCounter extends YaveRenderingSystem {
  private _textElement: HTMLElement;

  constructor() {
    super();
    this._textElement = document.createElement('span');
    this._textElement.style.position = 'absolute';
    this._textElement.style.top = '0';
    this._textElement.style.right = '0';
    this._textElement.style.padding = '0.5rem';
    this._textElement.style.color = 'white';
    this._textElement.style.background = 'rgba(0,0,0,0.25)';
    this._textElement.style.fontFamily = 'sans-serif';
    this._textElement.style.userSelect = 'none';
    document.body.appendChild(this._textElement);
  }

  process(options?: RunOptions): void {
    // TODO: Clean this up so that I don't need all of these in every single system that overrides process
    if (this._engine === null || this._engine === undefined) return;

    // Need deltaTime
    if (options === undefined) return;

    this._textElement.textContent = `FPS ${Math.round(
      (1 / options.deltaTime) * 1000
    )}`;
  }
}
