import { Component } from '@trixt0r/ecs';
import { Vector } from '../../utils';

/**
 * Position Component to represent an entity's position in world space.
 * TODO: There's code duplication between this and scale (except scale's constructor works slightly differently).
 */
export class Position extends Vector implements Component {
  /**
   * Position on the x axis.
   */
  public declare x: number;
  /**
   * Position on the y axis.
   */
  public declare y: number;
  /**
   * Position on the z axis.
   */
  public declare z: number;

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
  /**
   * Create a position component from the given vector.
   */
  constructor(vector: Vector);
  constructor(x: number | Vector = 0, y = 0, z = 0) {
    // If a vector is passed, reassign x, y, z to the vector values
    if (x instanceof Vector) {
      const vec = x;
      x = vec.x;
      z = vec.z;
      y = vec.y;
    }

    super(x, y, z);
  }
}
