import {
  createQueryForm,
  createFilterGroup,
} from '../../query-builder/query-builder-forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';

/** Angular Form Builder */
const fb = new FormBuilder();
/** Default choropleth layer value */
const DEFAULT_CHOROPLETH = {
  name: 'New choropleth layer',
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
const DEFAULT_MAP = {
  title: null,
  query: null,
  latitude: 0,
  longitude: 0,
  zoom: 2,
  category: null,
  basemap: null,
  centerLong: null,
  centerLat: null,
  popupFields: [],
  onlineLayers: [],
  markersRules: [],
  choropleths: [],
};

// === CHOROPLETH ===
/**
 * Create new choropleth layer form from value
 *
 * @param value value of choropleth layer, optional
 * @returns new form group
 */
export const choroplethForm = (value?: any): FormGroup =>
  fb.group({
    name: [get(value, 'name', DEFAULT_CHOROPLETH.name), [Validators.required]],
    geoJSON: [
      get(value, 'geoJSON', DEFAULT_CHOROPLETH.geoJSON),
      [Validators.required],
    ],
    geoJSONname: [
      get(value, 'geoJSONname', DEFAULT_CHOROPLETH.geoJSONname),
      [Validators.required],
    ],
    geoJSONfield: [
      get(value, 'geoJSONfield', DEFAULT_CHOROPLETH.geoJSONfield),
      [Validators.required],
    ],
    opacity: [get(value, 'opacity', DEFAULT_CHOROPLETH.opacity)],
    place: [
      get(value, 'place', DEFAULT_CHOROPLETH.place),
      [Validators.required],
    ],
    divisions: fb.array(
      get(value, 'divisions', DEFAULT_CHOROPLETH.divisions).map((x: any) =>
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
export const divisionForm = (value?: any): FormGroup =>
  fb.group({
    label: [get(value, 'label', DEFAULT_DIVISION.label)],
    color: [get(value, 'color', DEFAULT_DIVISION.color)],
    filter: createFilterGroup(
      get(value, 'filter', DEFAULT_DIVISION.filter),
      null
    ),
  });

// === MARKERS ===
/**
 * Create marker rule form from value
 *
 * @param value marker rule value ( optional )
 * @returns new form group
 */
export const markerRuleForm = (value?: any): FormGroup =>
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
    filter: createFilterGroup(
      get(value, 'filter', DEFAULT_MARKER_RULE.filter),
      null
    ),
  });

// === MAP ===

/**
 * Create map form from value
 *
 * @param id widget id
 * @param value map settings ( optional )
 * @returns map form
 */
export const mapform = (id: any, value?: any): FormGroup =>
  fb.group({
    id,
    title: [get(value, 'title', DEFAULT_MAP.title)],
    query: createQueryForm(get(value, 'query', DEFAULT_MAP.query), true),
    latitude: [
      get(value, 'latitude', DEFAULT_MAP.latitude),
      [Validators.min(-90), Validators.max(90)],
    ],
    longitude: [
      get(value, 'longitude', DEFAULT_MAP.longitude),
      [Validators.min(-180), Validators.max(180)],
    ],
    zoom: [
      get(value, 'zoom', DEFAULT_MAP.zoom),
      [Validators.min(2), Validators.max(18)],
    ],
    category: [get(value, 'category', DEFAULT_MAP.category)],
    basemap: [get(value, 'basemap', DEFAULT_MAP.basemap)],
    centerLong: [
      get(value, 'centerLong', DEFAULT_MAP.centerLong),
      [Validators.min(-180), Validators.max(180)],
    ],
    centerLat: [
      get(value, 'centerLat', DEFAULT_MAP.centerLat),
      [Validators.min(-90), Validators.max(90)],
    ],
    popupFields: [get(value, 'popupFields', DEFAULT_MAP.popupFields)],
    onlineLayers: [get(value, 'onlineLayers', DEFAULT_MAP.onlineLayers)],
    markerRules: fb.array(
      get(value, 'markerRules', DEFAULT_MAP.markersRules).map((x: any) =>
        markerRuleForm(x)
      )
    ),
    choropleths: fb.array(
      get(value, 'choropleths', DEFAULT_MAP.choropleths).map((x: any) =>
        choroplethForm(x)
      )
    ),
  });
