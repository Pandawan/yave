import { Component } from '@trixt0r/ecs';

/**
 * Anchor Component to represent an entity's anchor/pivot.
 */
export class Anchor implements Component {
  /**
   * Anchor on the x axis.
   */
  public x: number;
  /**
   * Anchor on the y axis.
   */
  public y: number;
  /**
   * Anchor on the z axis.
   */
  public z: number;

  /**
   * Create an anchor component with default values of 0.5 (center).
   */
  constructor();
  /**
   * Create an anchor component, applying the same value to all three directions.
   */
  constructor(value: number);
  /**
   * Create a 2D anchor component.
   */
  constructor(x: number, y: number);
  /**
   * Create a 3D anchor component.
   */
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    // If only x is assigned, set it to all directions
    if (x !== undefined && y === undefined && z === undefined) {
      this.x = x;
      this.y = x;
      this.z = x;
    }
    // Otherwise, it will auto-set x, y, and z based on passed parameters
    else {
      this.x = x ?? 0.5;
      this.y = y ?? 0.5;
      this.z = z ?? 0.5;
    }
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
