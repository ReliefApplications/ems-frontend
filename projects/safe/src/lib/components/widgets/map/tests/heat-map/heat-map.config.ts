import { HeatMapOptions } from './heat-map.interface';
/** Default heatmap options */
export const defaultHeatMapOptions: HeatMapOptions = {
  gradient: {
    0: '#08d1d1',
    0.25: '#08d169',
    0.5: '#deba07',
    0.75: '#de6707',
    1: '#de0715',
  },
  max: 1.0,
  radius: 10,
  blur: 15,
  minOpacity: 0.5,
  maxZoom: 18,
};
