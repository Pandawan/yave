/**
 * Represents a position, direction, rotation, etc. (can be used for 2D and 3D coordinates).,
 */
export class Vector {
  public x: number;
  public y: number;
  public z: number;

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
  constructor(x = 0, y = 0, z = 0) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  public set(x: number, y: number, z = 0): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
