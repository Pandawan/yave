import { Rotation } from './rotation';

describe('Rotation Component', () => {
  describe('constructor', () => {
    it('should set default values when used with empty parameters', () => {
      const rot = new Rotation();
      expect(rot.x).toBe(0);
      expect(rot.y).toBe(0);
      expect(rot.z).toBe(0);
    });

    it('should set z when used with one parameter', () => {
      const rot = new Rotation(1);
      expect(rot.x).toBe(0);
      expect(rot.y).toBe(0);
      expect(rot.z).toBe(1);
    });

    it('should set x, y, and z when used with three parameters', () => {
      const rot = new Rotation(1, 2, 3);
      expect(rot.x).toBe(1);
      expect(rot.y).toBe(2);
      expect(rot.z).toBe(3);
    });

    it('should clamp values correctly between 0 and 360', () => {
      const rot = new Rotation(-30, 405, 780);
      expect(rot.x).toBe(330); // Under range
      expect(rot.y).toBe(45); // Above range
      expect(rot.z).toBe(60); // More than one revolution
    });
  });

  describe('fromRadians', () => {
    it('should set z when used with one parameter', () => {
      const rot = Rotation.fromRadians(Math.PI / 4);
      expect(rot.x).toBeCloseTo(0);
      expect(rot.y).toBeCloseTo(0);
      expect(rot.z).toBeCloseTo(45); // pi/4 rad = 45deg
    });

    it('should set x, y, and z when used with three parameters', () => {
      const rot = Rotation.fromRadians(Math.PI / 6, Math.PI / 4, Math.PI / 3);
      expect(rot.x).toBeCloseTo(30);
      expect(rot.y).toBeCloseTo(45);
      expect(rot.z).toBeCloseTo(60);
    });

    it('should clamp values correctly between 0 and 2PI', () => {
      const rot = Rotation.fromRadians(
        -Math.PI / 6,
        (Math.PI * 9) / 4,
        (Math.PI * 13) / 3
      );
      expect(rot.x).toBeCloseTo(330); // Under range
      expect(rot.y).toBeCloseTo(45); // Above range
      expect(rot.z).toBeCloseTo(60); // More than one revolution
    });
  });

  describe('radians', () => {
    it('should return a radian value', () => {
      const rot = new Rotation(30, 45, 60);
      expect(rot.radians.x).toBeCloseTo(Math.PI / 6);
      expect(rot.radians.y).toBeCloseTo(Math.PI / 4);
      expect(rot.radians.z).toBeCloseTo(Math.PI / 3);
    });

    it('should convert radian values to degrees', () => {
      const rot = new Rotation();
      rot.radians.x = Math.PI / 6;
      rot.radians.y = Math.PI / 4;
      rot.radians.z = Math.PI / 3;
      expect(rot.x).toBeCloseTo(30);
      expect(rot.y).toBeCloseTo(45);
      expect(rot.z).toBeCloseTo(60);
    });
  });

  it('should output with toString', () => {
    const rot = new Rotation(1, 2, 3);
    expect(rot.toString()).toBe('(1, 2, 3)');
  });
});
