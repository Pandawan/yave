import { normalize } from './math';

describe('Math Utils', () => {
  describe('normalize', () => {
    it("shouldn't change value between range", () => {
      expect(normalize(5, 0, 10)).toBe(5);
    });

    it('should wrap a large value to start correctly', () => {
      expect(normalize(12, 0, 10)).toBe(2);
    });

    it('should wrap a small value to end correctly', () => {
      expect(normalize(-2, 0, 10)).toBe(8);
    });

    it('should still work with values that are more than twice the range away', () => {
      expect(normalize(52, 0, 10)).toBe(2);
    });
  });
});
