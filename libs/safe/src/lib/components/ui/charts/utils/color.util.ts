/**
 * Get a color by index in palette
 *
 * @param palette color palette
 * @param index index to search for
 * @returns color
 */
export const getColor = (palette: string[], index: number): string => {
  return palette[index % palette.length];
};
