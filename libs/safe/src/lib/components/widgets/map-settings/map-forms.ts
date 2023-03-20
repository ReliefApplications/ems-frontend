import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import { MapLayerI } from './map-layers/map-layers.component';
import {
  MapControls,
  DefaultMapControls,
  MapConstructorSettings,
} from '../../ui/map/interfaces/map.interface';
import { Layer } from '../../../models/layer.model';

type Nullable<T> = { [P in keyof T]: T[P] | null };
/** Interface for the maps settings */
export interface MapSettingsI extends MapConstructorSettings {
  layers: MapLayerI[];
}

/** Angular Form Builder */
const fb = new FormBuilder();

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
  controls: DefaultMapControls,
  arcGisWebMap: null,
};

/**
 * Create layer form from value
 *
 * @param value layer value ( optional )
 * @returns new form group
 */
export const createLayerForm = (value?: Layer) =>
  fb.group({
    // Layer properties
    id: [get(value, 'id', null)],
    name: [get(value, 'name', null), Validators.required],
    type: [get(value, 'type', null), Validators.required],
    defaultVisibility: [
      get(value, 'defaultVisibility', true),
      Validators.required,
    ],
    opacity: [get(value, 'opacity', 0.8), Validators.required],
    visibilityRangeStart: [
      get(value, 'visibilityRangeStart', 2),
      Validators.required,
    ],
    visibilityRangeEnd: [
      get(value, 'visibilityRangeEnd', 18),
      Validators.required,
    ],

    // Layer style
    style: fb.group({
      color: [get(value, 'style.color', '#0090d1')],
      size: [get(value, 'style.size', 24)],
      icon: new FormControl<MapLayerI['style']['icon']>(
        get(value, 'style.icon', 'leaflet_default')
      ),
    }),

    // Layer datasource
    datasource: fb.group({
      origin: new FormControl<MapLayerI['datasource']['origin']>(
        get(value, 'datasource.source', 'resource'),
        Validators.required
      ),
      resource: [get(value, 'datasource.resource', null)],
      layout: [get(value, 'datasource.layout', null)],
      aggregation: [get(value, 'datasource.aggregation', null)],
      refData: [get(value, 'datasource.refData', null)],
    }),
  });

/**
 * Create layer cluster form from value
 *
 * @param value cluster value ( optional )
 * @returns new form group
 */
export const createClusterForm = (value?: any): FormGroup =>
  fb.group({
    overrideSymbol: [get(value, 'overrideSymbol', false), Validators.required],
    symbol: [get(value, 'symbol ', '')],
    radius: [get(value, 'radius', 80), Validators.required],
    sizeRangeStart: [get(value, 'sizeRangeStart', 2), Validators.required],
    sizeRangeEnd: [get(value, 'sizeRangeEnd', 8)],
    fields: [get(value, 'fields', ''), Validators.required],
    label: [get(value, 'label', ''), Validators.required],
    popups: [get(value, 'popups', ''), Validators.required],
  });

export type LayerFormT = ReturnType<typeof createLayerForm>;

// === MAP ===

/**
 * Create map controls from value
 *
 * @param value map controls value ( optional )
 * @returns new form group
 */
export const createMapControlsForm = (value?: MapControls): FormGroup =>
  fb.group({
    timedimension: [get(value, 'timedimension', false)],
    download: [get(value, 'download', true)],
    legend: [get(value, 'legend', true)],
    measure: [get(value, 'measure', false)],
    layer: [get(value, 'layer', true)],
    search: [get(value, 'search', false)],
  });

/**
 * Create map form from value
 *
 * @param id widget id
 * @param value map settings ( optional )
 * @returns map form
 */
export const createMapWidgetFormGroup = (id: any, value?: any): FormGroup =>
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
    // popupFields: [get(value, 'popupFields', DEFAULT_MAP.popupFields)],
    // onlineLayers: [get(value, 'onlineLayers', DEFAULT_MAP.onlineLayers)],
    layers: [get(value, 'layers', [])] as string[],
    controls: createMapControlsForm(
      get(value, 'controls', DEFAULT_MAP.controls)
    ),
    arcGisWebMap: [get(value, 'arcGisWebMap', DEFAULT_MAP.arcGisWebMap)],
  });
