import { IconName } from '../const/fa-icons';
import { generateIconHTML } from './generateIcon';
import * as L from 'leaflet';

/**
 * Creates a new custom leaflet marker
 *
 * @param color Color set in the marker
 * @param opacity Opacity set in the marker(0>opacity<1)
 * @param size Font size in the marker(px)
 * @returns HTML template where to place the new marker
 */
const markerHtmlStyles = (color: string, opacity: number, size: number) => {
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
 * @param customMakerStylesProperties Properties related to the custom marker styles properties
 * @param customMakerStylesProperties.color Color for the custom marker
 * @param customMakerStylesProperties.opacity Opacity for the custom marker
 * @param htmlTemplate Html template for the div container
 * @param className Class name for the icon div container
 * @returns Div element with the icon
 */
export const createCustomDivIcon = (
  iconProperties?: {
    size: number;
    icon: IconName | 'leaflet_default';
    color: string;
  },
  customMakerStylesProperties?: {
    color: string;
    opacity: number;
  },
  htmlTemplate: any = '',
  className: string = 'custom-marker'
) => {
  const size = iconProperties?.size || 24;

  // If we receive an icon we use that to create the div template
  if (iconProperties) {
    // fa-icons use the generateIconHtml
    if (iconProperties.icon !== 'leaflet_default') {
      const { icon, color } = iconProperties;
      const htmlIcon = generateIconHTML({ size, color, icon });
      if (!htmlTemplate) {
        htmlTemplate = htmlIcon;
      } else {
        htmlTemplate = htmlTemplate + htmlIcon.outerHTML;
      }
    } else {
      // The default icon(leaflet-default) uses the markerHtmlStyles
      // size set for marker is half that the one for the icon to keep same visibility
      htmlTemplate = markerHtmlStyles(iconProperties.color, 1, size / 2);
    }
  }

  /**
   * If we receive custom marker styling properties we use them
   * to create the div template
   */
  if (customMakerStylesProperties) {
    const { color, opacity } = customMakerStylesProperties;
    // size set for marker is half that the one for the icon to keep same visibility
    htmlTemplate = markerHtmlStyles(color, opacity, size / 2);
  }

  const divIcon = L.divIcon({
    className,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [size / 2, -36],
    html: htmlTemplate,
  });

  return divIcon;
};
