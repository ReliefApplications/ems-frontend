/**
 * Adds transparency to a color (HEX or RGBA)
 *
 * @param color Color to add transparency to (string)
 * @param alpha Alpha value (0-1)
 * @returns Color with transparency (string)
 */
export const addTransparency = (color: string, alpha: number = 0.7): string => {
  // match rgba color
  const rgbaColor = color.match(
    /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(([0-9]*[.])?[0-9]+)\)$/
  );
  if (rgbaColor)
    return `rgba(${rgbaColor[1]}, ${rgbaColor[2]}, ${rgbaColor[3]}, ${
      alpha * parseFloat(rgbaColor[4] || '1')
    })`;

  // match hex color
  const hexColor = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  if (!hexColor) return color;

  const hex = hexColor[1];
  const r = parseInt(
    hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2),
    16
  );
  const g = parseInt(
    hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4),
    16
  );
  const b = parseInt(
    hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6),
    16
  );
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
