import { Component } from '@trixt0r/ecs';
import { Text as PixiText, TextStyle as PixiTextStyle } from 'pixi.js';

// NOTE: This is named TextRendering because "Text" name conflicts with pixi.js' Text and might be too confusing
export class TextRendering implements Component {
  /**
   * The PIXI.Text object.
   */
  public textObject: PixiText;

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
  public get style(): PixiTextStyle {
    return this.textObject.style;
  }

  public set style(value: PixiTextStyle) {
    this.textObject.style = value;
  }

  /**
   * Whether or not the text has been added to the renderingEngine.
   * (This prevents it from being added/rendered multiple times).
   */
  public addedToEngine = false;

  constructor(text: string, fontSize: number, color: number);
  constructor(text: string, style: PixiTextStyle);
  constructor(text: PixiText);
  constructor(
    text: string | PixiText,
    styleOrFontSize: number | PixiTextStyle = 16,
    color = 0xffffff
  ) {
    if (text instanceof PixiText) {
      this.textObject = text;
      return;
    }

    let style: PixiTextStyle = new PixiTextStyle();

    if (typeof styleOrFontSize === 'number') {
      style.fontSize = styleOrFontSize;
      style.fill = color;
    } else {
      style = styleOrFontSize;
    }

    this.textObject = new PixiText(text, style);
  }
}
