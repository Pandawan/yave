import { AbstractRendering } from './renderingEngine';

describe('AbstractRendering', () => {
  class MockRendering extends AbstractRendering<{}> {
    init = jest.fn();
    load = jest.fn();
    render = jest.fn();
  }

  describe('constructor', () => {
    it('should work when the container exists', () => {
      document.body.innerHTML = '<div id="DOES_EXIST"></div>';
      expect(() => new MockRendering('DOES_EXIST')).not.toThrow();
    });

    it('should error when the container does not exist', () => {
      expect(() => new MockRendering('DOES_NOT_EXIST')).toThrow();
    });
  });
});
