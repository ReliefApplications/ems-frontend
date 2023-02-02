import { generateGeoJSONPoints } from './util-test';

/**
 * Creation of the cluster group
 *
 * @param map map to be used
 * @param L to be able to use Leaflet from CDN
 * @returns the cluster group
 */
export const generateClusterLayer = (map: any, L: any) => {
  const clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: false,
    iconCreateFunction: (cluster: any) =>
      L.divIcon({
        html:
          cluster.getChildCount() +
          `<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178">
            <path fill="#cc756b" stroke="#FFF" stroke-width="6" stroke-miterlimit="10"
              d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/>
            <circle fill="#fff" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="48"/>
          </svg>
        `,
        className: 'leaflet-data-marker',
        iconAnchor: [12, 32],
        iconSize: [25, 30],
        popupAnchor: [0, -28],
      }),
  });

  clusterGroup.on('clusterclick', (event: any) => {
    const children = event.layer.getAllChildMarkers();
    let popupContent = 'test popup';
    children.forEach((child: any) => {
      popupContent +=
        ' and new test child ' + child.feature.properties.title + '.';
    });
    L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map);
  });
  const clusterLayer = L.geoJSON(generateGeoJSONPoints(200), {
    onEachFeature: (feature: any, layer: any) => {
      layer.bindPopup('point popup ' + feature.properties.title);
    },
  });
  clusterGroup.addLayer(clusterLayer);
  return clusterGroup;
};
