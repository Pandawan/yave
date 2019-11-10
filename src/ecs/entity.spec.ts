import { YaveEntity } from './entity';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe('YaveEntity', () => {
  const entity = new YaveEntity();

  it('should have a pre-set uuid', () => {
    expect(typeof entity.id).toBe('string');
    expect(entity.id).toMatch(uuidRegex);
  });
});
