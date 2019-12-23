import { Component } from '@trixt0r/ecs';
import { Vector } from '../../utils';

/**
 * Scale Component to represent an entity's scale/size in world space.
 */
export class Scale extends Vector implements Component {
  /**
   * Scale on the x axis.
   */
  public x: number;
  /**
   * Scale on the y axis.
   */
  public y: number;
  /**
   * Scale on the z axis.
   */
  public z: number;

  /**
   * Create a scale component with default values of 1.
   */
  constructor();
  /**
   * Create a scale component, applying the same value to all three directions.
   */
  constructor(value: number);
  /**
   * Create a 2D scale component.
   */
  constructor(x: number, y: number);
  /**
   * Create a 3D scale component.
   */
  constructor(x: number, y: number, z: number);
  /**
   * Create a scale component from the given vector.
   */
  constructor(vector: Vector);
  constructor(x?: number | Vector, y?: number, z?: number) {
    // If a vector is passed, reassign x, y, z to the vector values
    if (x instanceof Vector) {
      const vec = x;
      x = vec.x;
      z = vec.z;
      y = vec.y;
    }

    // If only x is assigned, set it to all directions
    if (x !== undefined && y === undefined && z === undefined) {
      super(x, x, x);
      this.x = x;
      this.y = x;
      this.z = x;
    } else {
      super(x ?? 1, y ?? 1, z ?? 1);
      // Otherwise, it will auto-set x, y, and z based on passed parameters
      this.x = x ?? 1;
      this.y = y ?? 1;
      this.z = z ?? 1;
    }
  }
}
