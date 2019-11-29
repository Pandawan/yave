import { Component } from '@trixt0r/ecs';

/**
 * Position Component to represent an entity's position in world space.
 * TODO: There's code duplication between this and scale (except scale's constructor works slightly differently).
 */
export class Position implements Component {
  /**
   * Position on the x axis.
   */
  public x: number;
  /**
   * Position on the y axis
   */
  public y: number;
  /**
   * Position on the z axis.
   */
  public z: number;

  /**
   * Create a position component with default values of 0.
   */
  constructor();
  /**
   * Create a 2D position component.
   */
  constructor(x: number, y: number);
  /**
   * Create a 3D position component.
   */
  constructor(x: number, y: number, z: number);
  constructor(x = 0, y = 0, z = 0) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  /**
   * Set the values of the position.
   */
  public set(x: number, y: number, z = 0): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
