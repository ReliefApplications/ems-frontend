import Color from 'color';
import * as L from 'leaflet';
import { LayerSymbol } from '../../../../models/layer.model';
import {
  IconName,
  icon as createIcon,
} from '@fortawesome/fontawesome-svg-core';
import { FaIconName, getIconDefinition } from '@oort-front/ui';

export type MarkerIconOptions = {
  icon: FaIconName | 'leaflet_default';
  color: string;
  size: number;
  opacity: number;
};

/** Default marker icon options */
export const DEFAULT_MARKER_ICON_OPTIONS: MarkerIconOptions = {
  icon: 'leaflet_default',
  color: '#0090d1',
  size: 24,
  opacity: 0.8,
};

/** Minimum cluster size in pixel */
const MIN_CLUSTER_SIZE = 20;

/** Maximum cluster size in pixel */
const MAX_CLUSTER_SIZE = 100;

/**
 * Generates an HTML element for an icon
 *
 * @param properties Properties of an icon
 * @param document Document
 * @returns The HTML element for the icon
 */
export const createFontAwesomeIcon = (
  properties: MarkerIconOptions,
  document: Document
) => {
  const { icon, size, color, opacity } = properties;

  // create a span element to set color, opacity and size
  const span = document.createElement('span');
  span.style.color = color;
  span.style.fontSize = `${size}px`;
  span.style.opacity = opacity.toString();

  // create an i element for the icon
  const iconDef = getIconDefinition(icon as IconName);
  const i = createIcon(iconDef, {
    styles: {
      height: `${size}px`,
      width: `${size}px`,
      'line-height': `${size}px`,
      'font-size': `${size}px`,
    },
  });
  // append the i element to the span element
  span.appendChild(i.node[0]);

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
  top: -50%;
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
    const htmlIcon = createFontAwesomeIcon(
      { size, color, icon, opacity },
      document
    );
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
    iconAnchor: L.point(size / 2, size / 2),
    popupAnchor: [0, -size / 2],
    html: htmlTemplate,
  });
  return divIcon;
};

/**
 * Create cluster div icon
 *
 * @param symbol cluster symbol
 * @param opacity opacity to apply
 * @param childCount Cluster children count
 * @param lightMode boolean to set text color to white or black
 * @param fontSize font size for the number displayed inside of the cluster marker
 * @param autoSize boolean to auto size cluster
 * @returns leaflet div icon
 */
export const createClusterDivIcon = (
  symbol: LayerSymbol,
  opacity: number,
  childCount: number,
  lightMode: boolean,
  fontSize: number,
  autoSize: boolean
) => {
  // const htmlTemplate = document.createElement('label');
  // htmlTemplate.textContent = childCount.toString();
  const size = autoSize
    ? (childCount / 50) * (MAX_CLUSTER_SIZE - MIN_CLUSTER_SIZE) +
      MIN_CLUSTER_SIZE
    : symbol.size;
  const mainColor = Color.rgb(
    // eslint-disable-next-line no-extra-boolean-cast
    Boolean(symbol.color) ? symbol.color : DEFAULT_MARKER_ICON_OPTIONS.color
  )
    .fade(0.2)
    .toString();
  const ringColor = Color.rgb(
    // eslint-disable-next-line no-extra-boolean-cast
    Boolean(symbol.color) ? symbol.color : DEFAULT_MARKER_ICON_OPTIONS.color
  )
    .fade(0.7)
    .toString();
  const styles = `
  background-color: ${mainColor};
  opacity: ${opacity};
  --tw-ring-color: ${ringColor};
  color: ${lightMode ? 'white' : 'black'};
  ${
    lightMode
      ? 'text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'
      : ''
  }
  `;
  return L.divIcon({
    html: `<div style="${styles}" class="ring-4"><span style="font-size: ${fontSize}px">${childCount}</span></div>`,
    className: `leaflet-data-cluster`,
    iconSize: L.point(size, size),
  });
};
