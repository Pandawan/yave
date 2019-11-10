import { AbstractEntity } from '@trixt0r/ecs';
import uuidv4 from 'uuid/v4';

/**
 * Simple wrapper over Entity with pre-set UUID
 */
export class YaveEntity extends AbstractEntity {
  constructor() {
    super(uuidv4());
  }
}
