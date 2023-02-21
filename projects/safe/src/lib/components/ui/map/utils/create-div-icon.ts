import { IconName } from '../const/fa-icons';
import * as L from 'leaflet';

export type MarkerIconOptions = {
  icon: IconName | 'leaflet_default';
  color: string;
  size: number;
  opacity: number;
};

/**
 * Generates an HTML element for an icon
 *
 * @param properties Properties of an icon
 * @returns The HTML element for the icon
 */
const createFontAwesomeIcon = (properties: MarkerIconOptions) => {
  const { icon, size, color, opacity } = properties;

  // create a span element to set color, opacity and size
  const span = document.createElement('span');
  span.style.color = color;
  span.style.fontSize = `${size}px`;
  span.style.opacity = opacity.toString();

  // create an i element for the icon
  const i = document.createElement('i');
  i.className = `fa fa-${icon}`;

  // append the i element to the span element
  span.appendChild(i);

  return span;
};
/**
 * Creates a new custom leaflet marker
 *
 * @param options Options for the marker icon
 * @param options.color Color set in the marker
 * @param options.opacity Opacity set in the marker(0>opacity<1)
 * @param options.size Font size in the marker(px)
 * @returns HTML template where to place the new marker
 */
const markerHtmlStyles = (
  options: Pick<MarkerIconOptions, 'color' | 'opacity' | 'size'>
) => {
  const { color, opacity, size } = options;
  const styles = `
  background-color: ${color};
  opacity: ${opacity};
  width: 2em;
  height: 2em;
  display: block;
  left: -0.5em;
  top: -0.5em;
  position: relative;
  border-radius: 2em 2em 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${size}px`;

  return `<span data-attr="${color},${opacity}" style="${styles}">
  <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
  </span>`;
};

/**
 * Create a custom div icon with the given icon or with custom
 *
 * @param iconProperties Properties related to the icon
 * @param iconProperties.size Size for the icon element
 * @param iconProperties.icon Icon identifier
 * @param iconProperties.color Color for the icon element
 * @param iconProperties.opacity Opacity for the icon element
 * @param htmlTemplate Html template for the div container
 * @param className Class name for the icon div container
 * @returns Div element with the icon
 */
export const createCustomDivIcon = (
  iconProperties: MarkerIconOptions,
  htmlTemplate: HTMLElement | string = '',
  className: string = 'custom-marker'
) => {
  const { icon, color, opacity, size } = iconProperties;
  let sizeForIconType = size;
  // fa-icons use the createFontAwesomeIcon
  if (iconProperties.icon !== 'leaflet_default') {
    const htmlIcon = createFontAwesomeIcon({ size, color, icon, opacity });
    if (htmlTemplate) {
      // add relative position for any label that is going to be added inside the icon span element
      htmlIcon.style.position = 'relative';
      htmlIcon.insertAdjacentElement('afterbegin', htmlTemplate as HTMLElement);
    }
    htmlTemplate = htmlIcon;
  } else {
    // The default icon(leaflet-default) uses the markerHtmlStyles
    // size set for marker is half that the one for the icon to keep same proportion
    sizeForIconType = size / 2;
    htmlTemplate = markerHtmlStyles({ color, opacity, size: sizeForIconType });
  }

  const divIcon = L.divIcon({
    className,
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, sizeForIconType),
    popupAnchor: [size / 2, -36],
    html: htmlTemplate,
  });

  return divIcon;
};
