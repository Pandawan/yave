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
      const pos = new Position(1, 1);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(1);
      expect(pos.z).toBe(0);
    });

    it('should work with three parameters', () => {
      const pos = new Position(1, 1, 1);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(1);
      expect(pos.z).toBe(1);
    });
  });

  it('should output with toString', () => {
    const pos = new Position(1, 1, 1);
    expect(pos.toString()).toBe('(1, 1, 1)');
  });
});
