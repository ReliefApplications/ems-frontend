import { generateGeoJSONPoints } from './util-test';
import { getRandomIcon } from '../const/fa-icons';
import { SafeMapLayersService } from '../../../../services/maps/map-layers.service';

/** Minimum cluster size in pixel */
const minClusterSize = 20;

/** Maximum cluster size in pixel */
const maxClusterSize = 100;

/**
 * Creation of the cluster group
 *
 * @param map map to be used
 * @param L to be able to use Leaflet from CDN
 * @param safeMapLayersService to create needed div icons
 * @returns the cluster group
 */
export const generateClusterLayer = (
  map: any,
  L: any,
  safeMapLayersService: SafeMapLayersService
) => {
  const total = 200;
  const clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: false,
    iconCreateFunction: (cluster: any) => {
      const iconSize =
        ((total * cluster.getChildCount()) / 100 / 100) *
          (maxClusterSize - minClusterSize) +
        minClusterSize;
      const iconProperties = {
        icon: getRandomIcon(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        size: iconSize,
      };
      const htmlTemplate = `<p>${cluster.getChildCount()}</p>`;
      return safeMapLayersService.createCustomDivIcon(
        iconProperties,
        undefined,
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
