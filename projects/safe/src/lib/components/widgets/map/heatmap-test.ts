import { generateGeoJSONPoints } from './util-test';
import 'leaflet.heat';
import { merge, get } from 'lodash';

declare let L: any;

type HeatMapOptions = {
  minOpacity: number;
  maxZoom: number;
  max: number;
  radius: number;
  blur: number;
  gradient: any;
};

const defaultHeatMapOptions: Partial<HeatMapOptions> = {
  // -> too pale
  // gradient: { -> not working ?
  //   0: '#86BDC6',
  //   0.25: '#AA5596',
  //   0.5: '#C01627',
  //   0.75: '#DB5D01',
  //   1: '#FAE800',
  // },
  max: 1.0,
  radius: 10,
  blur: 15,
};

export const generateHeatMap = (
  map: any,
  options?: Partial<HeatMapOptions>
) => {
  const geoJSON = generateGeoJSONPoints(10000);
  const heatArray: any[] = [];
  geoJSON.features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      heatArray.push([
        feature.geometry.coordinates[1], // lat
        feature.geometry.coordinates[0], // long
        get(feature, 'properties.weight', 1), // weight -> should be in properties.weight of the feature
      ]);
    }
  });
  // L.geoJSON(geoJSON, {
  //   pointToLayer: (feature: any, latlng: any) =>
  //     L.circleMarker(latlng, { opacity: 0 }),
  //   onEachFeature: (feature: any, layer: any) => {
  //     layer.bindPopup('super test');
  //   },
  // }).addTo(map);
  // https://github.com/Leaflet/Leaflet.heat for options
  const heatMapLayer = L.heatLayer(
    heatArray,
    merge(defaultHeatMapOptions, options)
  );
  heatMapLayer.on('click', (event: any) => {
    console.log(event);
  });
  heatMapLayer.addTo(map);
};
