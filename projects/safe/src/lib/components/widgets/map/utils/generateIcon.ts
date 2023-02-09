import { FA_ICONS } from '../const/fa-icons';

/** Properties of an icon */
export type IconPropertiesI = {
  icon: typeof FA_ICONS[number];
  size?: number;
  color?: string;
};

/**
 * Generates an HTML element for an icon
 *
 * @param properties Properties of an icon
 * @returns The HTML element for the icon
 */
export const generateIconHTML = (properties: IconPropertiesI) => {
  const { icon, size, color } = properties;

  // create a span element to set color, opacity and size
  const span = document.createElement('span');
  span.style.color = color ?? '#000';
  span.style.fontSize = `${size ?? 10}px`;

  // create an i element for the icon
  const i = document.createElement('i');
  i.className = `fa fa-${icon}`;

  // append the i element to the span element
  span.appendChild(i);

  // return the span element
  return span;
};
