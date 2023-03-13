import {
  // createQueryForm,
  createFilterGroup,
} from '../../query-builder/query-builder-forms';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import { MapLayerI } from './map-layers/map-layers.component';

type Nullable<T> = { [P in keyof T]: T[P] | null };
/** Interface for the maps settings */
export interface MapSettingsI {
  title: string;
  zoom: number;
  basemap: string;
  centerLong: number;
  centerLat: number;
  layers: MapLayerI[];
  timeDimension: boolean;
  arcGisWebMap: string;
}

/** Angular Form Builder */
const fb = new UntypedFormBuilder();
/** Default clorophlet value */
const DEFAULT_CLOROPHLET = {
  name: 'New clorophlet',
  geoJSON: '',
  geoJSONname: '',
  geoJSONfield: '',
  opacity: 100,
  place: '',
  divisions: [],
};
/** Default division value */
const DEFAULT_DIVISION = {
  label: 'New division',
  color: '#0090d1',
  filter: {
    logic: ['and'],
    filters: [],
  },
};
/** Default marker rule */
const DEFAULT_MARKER_RULE = {
  label: 'New rule',
  color: '#0090d1',
  size: 1,
  filter: {
    logic: ['and'],
    filters: [],
  },
};
/** Default map value */
const DEFAULT_MAP: Nullable<MapSettingsI> = {
  title: null,
  // query: null,
  // latitude: 0,
  // longitude: 0,
  zoom: 2,
  // category: null,
  basemap: null,
  centerLong: null,
  centerLat: null,
  // popupFields: [],
  // onlineLayers: [],
  // markersRules: [],
  // clorophlets: [],
  layers: [],
  timeDimension: true,
  arcGisWebMap: null
};

// === CLOROPHLET ===
/**
 * Create new clorophlet form from value
 *
 * @param value value of clorophlet, optional
 * @returns new form group
 */
export const clorophletForm = (value?: any): UntypedFormGroup =>
  fb.group({
    name: [get(value, 'name', DEFAULT_CLOROPHLET.name), [Validators.required]],
    geoJSON: [
      get(value, 'geoJSON', DEFAULT_CLOROPHLET.geoJSON),
      [Validators.required],
    ],
    geoJSONname: [
      get(value, 'geoJSONname', DEFAULT_CLOROPHLET.geoJSONname),
      [Validators.required],
    ],
    geoJSONfield: [
      get(value, 'geoJSONfield', DEFAULT_CLOROPHLET.geoJSONfield),
      [Validators.required],
    ],
    opacity: [get(value, 'opacity', DEFAULT_CLOROPHLET.opacity)],
    place: [
      get(value, 'place', DEFAULT_CLOROPHLET.place),
      [Validators.required],
    ],
    divisions: fb.array(
      get(value, 'divisions', DEFAULT_CLOROPHLET.divisions).map((x: any) =>
        divisionForm(x)
      )
    ),
  });

/**
 * Create new division form from value
 *
 * @param value value of division, optional
 * @returns new division group
 */
export const divisionForm = (value?: any): UntypedFormGroup =>
  fb.group({
    label: [get(value, 'label', DEFAULT_DIVISION.label)],
    color: [get(value, 'color', DEFAULT_DIVISION.color)],
    filter: createFilterGroup(get(value, 'filter', DEFAULT_DIVISION.filter)),
  });

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

// === MARKERS ===
/**
 * Create marker rule form from value
 *
 * @param value marker rule value ( optional )
 * @returns new form group
 */
export const markerRuleForm = (value?: any): UntypedFormGroup =>
  fb.group({
    label: [
      get(value, 'label', DEFAULT_MARKER_RULE.label),
      [Validators.required],
    ],
    color: [get(value, 'color', DEFAULT_MARKER_RULE.color)],
    size: [
      get(value, 'size', DEFAULT_MARKER_RULE.size),
      [Validators.min(1), Validators.max(10)],
    ],
    filter: createFilterGroup(get(value, 'filter', DEFAULT_MARKER_RULE.filter)),
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
    // resource: [get(value, 'resource', null), Validators.required],
    // query: createQueryForm(get(value, 'query', DEFAULT_MAP.query), true),
    // latitude: [
    //   get(value, 'latitude', DEFAULT_MAP.latitude),
    //   [Validators.min(-90), Validators.max(90)],
    // ],
    // longitude: [
    //   get(value, 'longitude', DEFAULT_MAP.longitude),
    //   [Validators.min(-180), Validators.max(180)],
    // ],
    zoom: [
      get(value, 'zoom', DEFAULT_MAP.zoom),
      [Validators.min(2), Validators.max(18)],
    ],
    // category: [get(value, 'category', DEFAULT_MAP.category)],
    basemap: [get(value, 'basemap', DEFAULT_MAP.basemap)],
    timeDimension: [get(value, 'timeDimension', DEFAULT_MAP.timeDimension)],
    centerLong: [
      get(value, 'centerLong', DEFAULT_MAP.centerLong),
      [Validators.min(-180), Validators.max(180)],
    ],
    centerLat: [
      get(value, 'centerLat', DEFAULT_MAP.centerLat),
      [Validators.min(-90), Validators.max(90)],
    ],
    // popupFields: [get(value, 'popupFields', DEFAULT_MAP.popupFields)],
    // onlineLayers: [get(value, 'onlineLayers', DEFAULT_MAP.onlineLayers)],
    // markerRules: fb.array(
    //   get(value, 'markerRules', DEFAULT_MAP.markersRules).map((x: any) =>
    //     markerRuleForm(x)
    //   )
    // ),
    // clorophlets: fb.array(
    //   get(value, 'clorophlets', DEFAULT_MAP.clorophlets).map((x: any) =>
    //     clorophletForm(x)
    //   )
    // ),
    layers: fb.array(
      get(value, 'layers', DEFAULT_MAP.layers).map((x: any) =>
        createLayerForm(x)
      )
    ),
    arcGisWebMap: [get(value, 'arcGisWebMap', DEFAULT_MAP.arcGisWebMap)],
  });
