import { Feature } from 'geojson';
import { Layer } from 'leaflet';
import { SafeMapPopupService } from '../map-popup/map-popup.service';
import { generateGeoJSONPoints } from './util-test';

/** Minimum cluster size in pixel */
const minClusterSize = 20;

/** Maximum cluster size in pixel */
const maxClusterSize = 100;

/** Cluster icon svg */
const clusterIconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M480 48c0-26.5-21.5-48-48-48H336c-26.5 0-48 21.5-48 48V96H224V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V96H112V24c0-13.3-10.7-24-24-24S64 10.7 64 24V96H48C21.5 96 0 117.5 0 144v96V464c0 26.5 21.5 48 48 48H304h32 96H592c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48H480V48zm96 320v32c0 8.8-7.2 16-16 16H528c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM240 416H208c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16zM128 400c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32zM560 256c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H528c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32zM256 176v32c0 8.8-7.2 16-16 16H208c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM112 160c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32zM256 304c0 8.8-7.2 16-16 16H208c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32zM112 320H80c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16zm304-48v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM400 64c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h32zm16 112v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16z"/></svg>';

/**
 * Creation of the cluster group
 *
 * @param map map to be used
 * @param L to be able to use Leaflet from CDN
 * @param mapPopupService map popup service
 * @returns the cluster group
 */
export const generateClusterLayer = (
  map: any,
  L: any,
  mapPopupService: SafeMapPopupService
) => {
  const total = 200;
  const clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: false,
    iconCreateFunction: (cluster: any) =>
      L.divIcon({
        html: cluster.getChildCount() + clusterIconSvg,
        className: 'leaflet-data-marker',
        iconAnchor: [12, 32],
        iconSize: new Array(2).fill(
          ((total * cluster.getChildCount()) / 100 / 100) *
            (maxClusterSize - minClusterSize) +
            minClusterSize
        ),
        // popupAnchor: [0, -28],
      }),
  });
  mapPopupService.addPopupToClusterClickEvent(map, clusterGroup);
  const clusterLayer = L.geoJSON(generateGeoJSONPoints(total), {
    onEachFeature: (feature: Feature<any>, layer: Layer) => {
      // Add popup on click because we destroy popup component each time we remove it
      // In order to destroy all event subscriptions an avoid memory leak
      layer.addEventListener('click', () => {
        const coordinates = {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        };
        // Initialize and get a SafeMapPopupComponent instance popup
        const popup = mapPopupService.setPopupComponentAndContent(
          map,
          [feature],
          coordinates
        );
        layer.bindPopup(popup);
      });
    },
  });
  clusterGroup.addLayer(clusterLayer);
  return clusterGroup;
};
