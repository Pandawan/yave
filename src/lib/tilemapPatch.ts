// eslint-disable-next-line
declare namespace PIXI.tilemap {
  interface CompositeRectTileLayer {
    addResizeableFrame(
      texture_: PIXI.Texture | string | number,
      x: number,
      y: number,
      tileWidth?: number,
      tileHeight?: number,
      animX?: number,
      animY?: number
    ): boolean;
  }
}

/**
 * This is a simple patch for the pixi-tilemap which adds support for resizeable frame (width & height)
 * while keeping the (Texture | string | number) identification which is lost when using addRect.
 */
PIXI.tilemap.CompositeRectTileLayer.prototype.addResizeableFrame = function addResizeableFrame(
  texture_: PIXI.Texture | string | number,
  x: number,
  y: number,
  tileWidth?: number,
  tileHeight?: number,
  animX?: number,
  animY?: number
): boolean {
  let texture: PIXI.Texture;
  let layer: PIXI.tilemap.RectTileLayer | null = null;
  let ind = 0;
  const children = this.children;

  if (typeof texture_ === 'number') {
    const childIndex = (texture_ / this.texPerChild) >> 0;
    layer = children[childIndex] as PIXI.tilemap.RectTileLayer;

    if (layer === null) {
      layer = children[0] as PIXI.tilemap.RectTileLayer;
      if (layer === null) {
        return false;
      }
      ind = 0;
    } else {
      ind = texture_ % this.texPerChild;
    }

    texture = layer.textures[ind];
  } else {
    if (typeof texture_ === 'string') {
      texture = PIXI.Texture.from(texture_);
    } else {
      texture = texture_ as PIXI.Texture;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as PIXI.tilemap.RectTileLayer;
      const tex = child.textures;
      for (let j = 0; j < tex.length; j++) {
        if (tex[j].baseTexture === texture.baseTexture) {
          layer = child;
          ind = j;
          break;
        }
      }
      if (layer !== null) {
        break;
      }
    }

    if (layer === null) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as PIXI.tilemap.RectTileLayer;
        if (child.textures.length < this.texPerChild) {
          layer = child;
          ind = child.textures.length;
          child.textures.push(texture);
          break;
        }
      }
      if (layer === null) {
        layer = new PIXI.tilemap.RectTileLayer(this.zIndex, texture);
        layer.compositeParent = true;
        layer.offsetX = PIXI.tilemap.Constant.boundSize;
        layer.offsetY = PIXI.tilemap.Constant.boundSize;
        children.push(layer);
        ind = 0;
      }
    }
  }

  layer.addRect(
    ind,
    texture.frame.x,
    texture.frame.y,
    x,
    y,
    tileWidth ?? texture.orig.width,
    tileHeight ?? texture.orig.height,
    animX,
    animY,
    texture.rotate
  );
  return true;
};
