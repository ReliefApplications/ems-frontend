import { FontSpec } from 'chart.js';

/** Default font size in pt */
export const DEFAULT_FONT_SIZE = 12;

/**
 * Gets the font spec object from the string representation
 *
 * @param specStr The font spec string
 * @returns The font spec object
 */
export const parseFontOptions = (
  specStr: string
): [Partial<FontSpec>, boolean] => {
  if (!specStr) {
    return [{}, false];
  }
  const res: Partial<FontSpec> = {};
  const sizeMatch = specStr.match(/\d+pt/);
  const fontSize = sizeMatch
    ? parseInt(sizeMatch[0].slice(0, sizeMatch[0].length - 2), 10)
    : DEFAULT_FONT_SIZE;
  const isBold = specStr.includes('bold');
  const isItalic = specStr.includes('italic');
  Object.assign(res, { size: fontSize });
  Object.assign(res, { weight: isBold ? 'bold' : 'normal' });
  Object.assign(res, { style: isItalic ? 'italic' : 'normal' });

  const isUnderline = specStr.includes('underline');
  return [res, isUnderline];
};
