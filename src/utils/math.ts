/**
 * Normalizes any number to a given range
 * by assuming the range wraps around when going below min or above max.
 *
 * NOTE: This is especially useful to wrap around angles (in rads or degs).
 * @param value The value to normalize.
 * @param start The start boundary.
 * @param end The end boundary.
 */
export function normalize(value: number, start: number, end: number): number {
  const width: number = end - start; //
  const offsetValue: number = value - start; // value relative to 0

  // Add start to reset back to start of original range
  return offsetValue - Math.floor(offsetValue / width) * width + start;
}
