/**
 * Represents a position, direction, rotation, etc. (can be used for 2D and 3D coordinates).,
 */
export class Vector {
  // TODO: Standardize Vector everywhere (position, rotation, cursor pos, cursor movement, etc.)
  /**
   * Create a Vector with default values of 0
   */
  constructor();
  /**
   * Create a 2D Vector (with x and y).
   */
  constructor(x: number, y: number);
  /**
   * Create a 3D Vector (with x, y, and z).
   */
  constructor(x: number, y: number, z: number);
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  /**
   * Set the values of the vector.
   */
  public set(x: number, y: number, z = 0): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
