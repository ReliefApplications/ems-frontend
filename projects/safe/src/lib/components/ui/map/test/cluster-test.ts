import { generateGeoJSONPoints } from './util-test';
import { getRandomIcon } from '../const/fa-icons';
import { createCustomDivIcon } from '../utils/create-div-icon';

/** Minimum cluster size in pixel */
const MIN_CLUSTER_SIZE = 20;

/** Maximum cluster size in pixel */
const MAX_CLUSTER_SIZE = 100;

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
          (MAX_CLUSTER_SIZE - MIN_CLUSTER_SIZE) +
        MIN_CLUSTER_SIZE;
      const iconProperties = {
        icon: getRandomIcon(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        size: iconSize,
        opacity: Math.max(Math.random(), 0.5),
      };
      const htmlTemplate = `<p>${cluster.getChildCount()}</p>`;
      return createCustomDivIcon(
        iconProperties,
        htmlTemplate,
        'leaflet-data-marker'
      );
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
