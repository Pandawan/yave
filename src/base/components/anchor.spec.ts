import { Anchor } from './anchor';

describe('Anchor Component', () => {
  describe('constructor', () => {
    it('should work with empty parameters', () => {
      const anchor = new Anchor();
      expect(anchor.x).toBe(0.5);
      expect(anchor.y).toBe(0.5);
      expect(anchor.z).toBe(0.5);
    });

    it('should work with one parameter', () => {
      const anchor = new Anchor(2);
      expect(anchor.x).toBe(2);
      expect(anchor.y).toBe(2);
      expect(anchor.z).toBe(2);
    });

    it('should work with two parameters', () => {
      const anchor = new Anchor(2, 3);
      expect(anchor.x).toBe(2);
      expect(anchor.y).toBe(3);
      expect(anchor.z).toBe(0.5);
    });

    it('should work with three parameters', () => {
      const anchor = new Anchor(2, 3, 4);
      expect(anchor.x).toBe(2);
      expect(anchor.y).toBe(3);
      expect(anchor.z).toBe(4);
    });
  });

  it('should output with toString', () => {
    const anchor = new Anchor(2, 3, 4);
    expect(anchor.toString()).toBe('(2, 3, 4)');
  });
});
