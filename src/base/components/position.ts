import { Component } from '@trixt0r/ecs';

/**
 * Position Component to represent an entity's position in world space.
 * TODO: Maybe this should extend from Vector so I don't have to repeat myself
 */
export class Position implements Component {
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
  constructor(public x = 0, public y = 0, public z = 0) {}

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
