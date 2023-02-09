import { generateGeoJSONPoints } from './util-test';
import { generateIconHTML } from './utils/generateIcon';
import { getRandomIcon } from './const/fa-icons';

/** Minimum cluster size in pixel */
const minClusterSize = 20;

/** Maximum cluster size in pixel */
const maxClusterSize = 100;

/**
 * Creation of the cluster group
 *
 * @param map map to be used
 * @param L to be able to use Leaflet from CDN
 * @returns the cluster group
 */
export const generateClusterLayer = (map: any, L: any) => {
  const total = 200;
  const clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: false,
    iconCreateFunction: (cluster: any) => {
      const iconSize =
        ((total * cluster.getChildCount()) / 100 / 100) *
          (maxClusterSize - minClusterSize) +
        minClusterSize;
      const clusterIcon = generateIconHTML({
        icon: getRandomIcon(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        size: iconSize,
      });

      return L.divIcon({
        html: `<p>${cluster.getChildCount()}</p>` + clusterIcon.outerHTML,
        className: 'leaflet-data-marker',
        iconAnchor: [12, 32],
        // popupAnchor: [0, -28],
      });
    },
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
  const clusterLayer = L.geoJSON(generateGeoJSONPoints(total), {
    onEachFeature: (feature: any, layer: any) => {
      layer.bindPopup('point popup ' + feature.properties.title);
    },
  });
  clusterGroup.addLayer(clusterLayer);
  return clusterGroup;
};
