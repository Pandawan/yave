import { Position } from './position';

describe('Position Component', () => {
  describe('constructor', () => {
    it('should work with empty parameters', () => {
      const pos = new Position();
      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
      expect(pos.z).toBe(0);
    });

    it('should work with two parameters', () => {
      const pos = new Position(1, 2);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(2);
      expect(pos.z).toBe(0);
    });

    it('should work with three parameters', () => {
      const pos = new Position(1, 2, 3);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(2);
      expect(pos.z).toBe(3);
    });
  });

  it('should output with toString', () => {
    const pos = new Position(1, 2, 3);
    expect(pos.toString()).toBe('(1, 2, 3)');
  });
});
