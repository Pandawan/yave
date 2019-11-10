import { YaveEngine } from '../engine';
import { YaveECS } from './ecs';

// Create a mock implementation of YaveEngine so it doesn't actually do anything
jest.mock('../engine');

describe('YaveECS', () => {
  const mockEngine = new YaveEngine();

  const ecs = new YaveECS(mockEngine);

  it('should have a yaveEngine property', () => {
    expect(ecs.yaveEngine).toBeInstanceOf(YaveEngine);
    expect(ecs.yaveEngine).toBe(mockEngine);
  });
});
