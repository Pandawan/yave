import { Component } from '@trixt0r/ecs';

export class Camera implements Component {
  /**
   * Whether or not this camera should affect the viewport.
   */
  public active: boolean;

  /**
   * ID of the entity that the camera should be following.
   * NOTE: The camera will retain its z position (zIndex).
   */
  public followEntity: string | number | null;

  /**
   * Create a camera component.
   */
  constructor(active = true) {
    this.active = active;
    this.followEntity = null;
  }
}
