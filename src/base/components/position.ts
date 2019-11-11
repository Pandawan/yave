import { Component } from '@trixt0r/ecs';

export class Position implements Component {
  /**
   * Create a position component.
   * @param x
   * @param y
   * @param z
   */
  constructor();
  constructor(x: number, y: number);
  constructor(x: number, y: number, z: number);
  constructor(public x = 0, public y = 0, public z = 0) {}

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
