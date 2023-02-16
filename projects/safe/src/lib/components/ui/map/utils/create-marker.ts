import * as L from 'leaflet';

/**
 * Creates custom marker icon for the Leaflet map.
 *
 * @param color Color of the marker
 * @param opacity Opacity of the marker
 * @returns Custom marker icon
 */
export const createCustomMarker = (color: string, opacity: number) => {
  const markerHtmlStyles = `
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
 justify-content: center;`;

  const icon = L.divIcon({
    className: 'custom-marker',
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span data-attr="${color},${opacity}" style="${markerHtmlStyles}">
     <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
   </span>`,
  });

  return icon;
};
