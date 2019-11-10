/**
 * Resolves after the given time.
 * @param ms How long to wait (in ms).
 * @returns
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
