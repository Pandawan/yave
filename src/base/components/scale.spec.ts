import { Scale } from './scale';
import { Vector } from '../../utils';

describe('Scale Component', () => {
  describe('constructor', () => {
    it('should work with empty parameters', () => {
      const scale = new Scale();
      expect(scale.x).toBe(1);
      expect(scale.y).toBe(1);
      expect(scale.z).toBe(1);
    });

    it('should work with one parameter', () => {
      const scale = new Scale(2);
      expect(scale.x).toBe(2);
      expect(scale.y).toBe(2);
      expect(scale.z).toBe(2);
    });

    it('should work with two parameters', () => {
      const scale = new Scale(2, 3);
      expect(scale.x).toBe(2);
      expect(scale.y).toBe(3);
      expect(scale.z).toBe(1);
    });

    it('should work with three parameters', () => {
      const scale = new Scale(2, 3, 4);
      expect(scale.x).toBe(2);
      expect(scale.y).toBe(3);
      expect(scale.z).toBe(4);
    });

    it('should work with a vector parameter', () => {
      const vec = new Vector(2, 3, 4);
      const scale = new Scale(vec);
      expect(scale.x).toBe(vec.x);
      expect(scale.y).toBe(vec.y);
      expect(scale.z).toBe(vec.z);
    });
  });
});
