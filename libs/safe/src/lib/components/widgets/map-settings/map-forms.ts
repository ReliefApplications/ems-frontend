import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import { MapLayerI } from './map-layers/map-layers.component';
import { MapConstructorSettings } from '../../ui/map/interfaces/map.interface';

type Nullable<T> = { [P in keyof T]: T[P] | null };
/** Interface for the maps settings */
export interface MapSettingsI extends MapConstructorSettings {
  layers: MapLayerI[];
}

/** Angular Form Builder */
const fb = new UntypedFormBuilder();

/** Default map value */
const DEFAULT_MAP: Nullable<MapSettingsI> = {
  title: null,
  // query: null,
  // latitude: 0,
  // longitude: 0,

  // category: null,
  basemap: null,
  initialState: {
    viewpoint: {
      center: {
        latitude: 0,
        longitude: 0,
      },
      zoom: 2,
    },
  },
  // onlineLayers: [],
  // markersRules: [],
  layers: [],
  timeDimension: true,
};

/**
 * Create layer form from value
 *
 * @param value layer value ( optional )
 * @returns new form group
 */
export const createLayerForm = (value?: MapLayerI): UntypedFormGroup =>
  fb.group({
    name: [get(value, 'name', null), [Validators.required]],
    type: [get(value, 'type', null), [Validators.required]],
    defaultVisibility: [
      get(value, 'defaultVisibility', true),
      [Validators.required],
    ],
    opacity: [get(value, 'opacity', 0.8), [Validators.required]],
    visibilityRangeStart: [
      get(value, 'visibilityRangeStart', 2),
      [Validators.required],
    ],
    visibilityRangeEnd: [
      get(value, 'visibilityRangeEnd', 18),
      [Validators.required],
    ],
    style: fb.group({
      color: [get(value, 'style.color', '#0090d1')],
      size: [get(value, 'style.size', 24)],
      icon: [get(value, 'style.icon', 'leaflet_default')],
    }),
  });

// === MAP ===
/**
 * Create map form from value
 *
 * @param id widget id
 * @param value map settings ( optional )
 * @returns map form
 */
export const createMapWidgetFormGroup = (
  id: any,
  value?: any
): UntypedFormGroup =>
  fb.group({
    id,
    title: [get(value, 'title', DEFAULT_MAP.title)],
    initialState: fb.group({
      viewpoint: fb.group({
        zoom: [
          get(
            value,
            'initialState.viewpoint.zoom',
            DEFAULT_MAP.initialState?.viewpoint.zoom
          ),
          [Validators.min(2), Validators.max(18)],
        ],
        center: fb.group({
          longitude: [
            get(
              value,
              'initialState.viewpoint.center.longitude',
              DEFAULT_MAP.initialState?.viewpoint.center.longitude
            ),
            [Validators.min(-180), Validators.max(180)],
          ],
          latitude: [
            get(
              value,
              'initialState.viewpoint.center.latitude',
              DEFAULT_MAP.initialState?.viewpoint.center.latitude
            ),
            [Validators.min(-90), Validators.max(90)],
          ],
        }),
      }),
    }),
    basemap: [get(value, 'basemap', DEFAULT_MAP.basemap)],
    timeDimension: [get(value, 'timeDimension', DEFAULT_MAP.timeDimension)],
    // onlineLayers: [get(value, 'onlineLayers', DEFAULT_MAP.onlineLayers)],
    layers: fb.array(
      get(value, 'layers', DEFAULT_MAP.layers).map((x: any) =>
        createLayerForm(x)
      )
    ),
  });
