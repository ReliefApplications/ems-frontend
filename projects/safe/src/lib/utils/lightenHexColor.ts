/**
 * Returns a lighter version of a hexadecimal color by a specified percentage.
 *
 * @param color - The hexadecimal color to be modified.
 * @param percent - The percentage by which to lighten the color.
 * @returns A hexadecimal color that is lighter than the original color.
 */
export const lightenHexColor = (color: string, percent: number) => {
  // Convert the color to RGB
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  // Lighten the color by the specified percent
  const rl = Math.round(r + (255 - r) * (percent / 100));
  const gl = Math.round(g + (255 - g) * (percent / 100));
  const bl = Math.round(b + (255 - b) * (percent / 100));

  // Convert the lightened color back to hex
  const rlHex = rl.toString(16).padStart(2, '0');
  const glHex = gl.toString(16).padStart(2, '0');
  const blHex = bl.toString(16).padStart(2, '0');

  return `#${rlHex}${glHex}${blHex}`;
};
