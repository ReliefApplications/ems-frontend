import Color from 'color';

/**
 * Generate a monochrome palette of 20 colors based on a hex color.
 *
 * @param baseColor - The base hex color to generate the palette from.
 * @returns An array of 20 monochrome colors in hex format.
 */
export const generateMonochromePalette = (baseColor: string): string[] => {
  // Regular expression to validate the input hex color
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

  if (!hexColorRegex.test(baseColor)) {
    throw new Error('Invalid hex color provided.');
  }

  const color = Color(baseColor);
  const palette: string[] = [];

  // Calculate steps to generate a monochrome palette
  const step = 100 / 19; // Divide the range into 20 steps (0-100%)

  // Generate the palette
  for (let i = 0; i < 20; i++) {
    const modifiedColor = color.lightness(i * step);
    if (modifiedColor.lightness() < 10) {
      palette.push(color.darken(0.1).hex());
    } else if (modifiedColor.lightness() > 90) {
      palette.push(color.lighten(0.1).hex());
    } else {
      palette.push(modifiedColor.hex());
    }
  }

  return palette;
};
