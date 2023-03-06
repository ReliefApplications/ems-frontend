import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';

/**
 * This function creates and returns a function that returns a
 * BlockScrollStrategy.
 *
 * @param {Overlay} overlay - an overlay
 * @returns A function that returns an instance of BlockScrollStrategy.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}
