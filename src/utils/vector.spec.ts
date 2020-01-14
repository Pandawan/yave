import { Vector } from './vector';

describe('Vector', () => {
  describe('constructor', () => {
    it('should set default values when used with empty parameters', () => {
      const v = new Vector();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should set x and y when used with two parameters', () => {
      const v = new Vector(1, 2);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(0);
    });

    it('should set x, y, and z when used with three parameters', () => {
      const v = new Vector(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe('helpers', () => {
    let v: Vector;
    beforeEach(() => {
      v = new Vector(1, 2, 3);
    });

    it('should set() values correctly', () => {
      v.set(3, 4);
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);

      v.set(5, 6, 7);
      expect(v.x).toBe(5);
      expect(v.y).toBe(6);
      expect(v.z).toBe(7);
    });

    it('should map() values correctly', () => {
      let counter = 0;
      v.map((value: number, index: number, vector: Vector) => {
        expect(index).toBe(counter++); // counter = 0, 1, 2
        expect(value).toBe(counter); // counter = 1, 2, 3 (after ++)
        expect(vector).toBe(v);
        return index + 3;
      });

      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
      expect(v.z).toBe(5);
    });

    it('should round values correctly', () => {
      v.x = 4.1;
      v.y = 5.8;
      v.z = 6.5;
      v.round();
      expect(v.x).toBe(4);
      expect(v.y).toBe(6);
      expect(v.z).toBe(7);
    });

    it('should floor values correctly', () => {
      v.x = 4.1;
      v.y = 5.8;
      v.z = 6.5;
      v.floor();
      expect(v.x).toBe(4);
      expect(v.y).toBe(5);
      expect(v.z).toBe(6);
    });

    it('should ceil values correctly', () => {
      v.x = 4.1;
      v.y = 5.8;
      v.z = 6.5;
      v.ceil();
      expect(v.x).toBe(5);
      expect(v.y).toBe(6);
      expect(v.z).toBe(7);
    });

    describe('type-manipulation', () => {
      it('should create a new vector when cloning', () => {
        expect(v.clone()).not.toBe(v);
      });

      it('should create a valid 3-element array by default', () => {
        const arr = v.toArray();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(3);
      });

      it('should create a valid 2-element array when enforcing 2d', () => {
        const arr = v.toArray(true);
        expect(arr.length).toBe(2);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
      });

      it('should create a valid 3-element array when not enforcing 2d', () => {
        const arr = v.toArray(false);
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(3);
      });

      it('should convert to a string', () => {
        expect(v.toString()).toBe('(1, 2, 3)');
        expect(v.toString(false)).toBe('(1, 2, 3)');
        expect(v.toString(true)).toBe('(1, 2)');
      });

      it('should convert from a string', () => {
        expect(Vector.fromString('(1)')).toMatchObject({
          x: 1,
          y: 0,
          z: 0,
        });

        expect(Vector.fromString('(1, -2)')).toMatchObject({
          x: 1,
          y: -2,
          z: 0,
        });

        expect(Vector.fromString('(1, -2, 3)')).toMatchObject({
          x: 1,
          y: -2,
          z: 3,
        });

        // Error handling
        expect(() => Vector.fromString('invalid argument')).toThrow();
        expect(() => Vector.fromString('(1, 2, 3, 4)')).toThrow();
      });
    });
  });
});
