import PIXI from '../../lib/pixi';
import { PixiRendering } from './pixiRendering';

// NOTE: This is named TextRendering because "Text" name conflicts with pixi.js' Text and might be too confusing
export class TextRendering extends PixiRendering {
  /**
   * The PIXI.Text object.
   */
  public textObject: PIXI.Text;

  /**
   * The text to render.
   */
  public get text(): string {
    return this.textObject.text;
  }

  public set text(value: string) {
    this.textObject.text = value;
  }

  /**
   * The style to render the text with.
   */
  public get style(): PIXI.TextStyle {
    return this.textObject.style;
  }

  public set style(value: PIXI.TextStyle) {
    this.textObject.style = value;
  }

  /**
   * The PIXI.Text object.
   * Note: PIXI.Text extends PIXI.Sprite, but we need a generic SpriteRendering for this.
   */
  public get sprite(): PIXI.Sprite {
    return this.textObject;
  }

  constructor(text: string, fontSize: number, color: number);
  constructor(text: string, style: PIXI.TextStyle);
  constructor(text: PIXI.Text);
  constructor(
    text: string | PIXI.Text,
    styleOrFontSize: number | PIXI.TextStyle = 16,
    color = 0xffffff
  ) {
    super();

    if (text instanceof PIXI.Text) {
      this.textObject = text;
      return;
    }

    let style: PIXI.TextStyle = new PIXI.TextStyle();

    if (typeof styleOrFontSize === 'number') {
      style.fontSize = styleOrFontSize;
      style.fill = color;
    } else {
      style = styleOrFontSize;
    }

    this.textObject = new PIXI.Text(text, style);
  }
}
