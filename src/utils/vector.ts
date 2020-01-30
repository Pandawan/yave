/**
 * Represents a position, direction, rotation, etc. (can be used for 2D and 3D coordinates).,
 */
export class Vector {
  public x: number;
  public y: number;
  public z: number;

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

  public set(x: number, y: number, z = 0): Vector {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public add(other: Vector): Vector {
    // TODO: Spec
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public map(
    callbackfn: (value: number, index: number, vector: Vector) => number
  ): Vector {
    this.x = callbackfn(this.x, 0, this);
    this.y = callbackfn(this.y, 1, this);
    this.z = callbackfn(this.z, 2, this);
    return this;
  }

  public round(): Vector {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  public floor(): Vector {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  public ceil(): Vector {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  public clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  /**
   * Convert the given vector to a 3-element array with [x, y, z].
   * @param as2D Whether or not to only request for the x and y component of the vector.
   */
  public toArray(as2D?: false): [number, number, number];
  /**
   * Convert the given vector to a 2-element array with [x, y].
   * @param as2D Whether or not to only request for the x and y component of the vector.
   */
  public toArray(as2D: true): [number, number];
  public toArray(as2D = false): [number, number] | [number, number, number] {
    return as2D ? [this.x, this.y] : [this.x, this.y, this.z];
  }

  /**
   * Convert the given vector to a string (x, y, z).
   * @param as2D Whether or not to only request for the x and y component of the vector.
   */
  public toString(as2D?: false): string;
  /**
   * Convert the given vector to a string (x, y).
   * @param as2D Whether or not to only request for the x and y component of the vector.
   */
  public toString(as2D: true): string;
  public toString(as2D = false): string {
    return as2D
      ? `(${this.x}, ${this.y})`
      : `(${this.x}, ${this.y}, ${this.z})`;
  }

  public static fromString(value: string): Vector {
    const match = value.match(
      /\( *(?:(-?[0-9.]+) *,)? *(?:(-?[0-9.]+) *,)? *(?:(-?[0-9.]+)) *\)/
    );

    if (match === undefined || match === null || match.length === 0) {
      throw new Error('Passed string could not be parsed as vector.');
    }

    // Take the match (array of strings) and convert it to an array of numbers
    const pos = match
      .slice(1, 4)
      .filter(val => val !== undefined && val !== null)
      .map(val => new Number(val).valueOf());

    return new this(pos?.[0] ?? 0, pos?.[1] ?? 0, pos?.[2] ?? 0);
  }
}
