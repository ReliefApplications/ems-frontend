import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import {
  MapControls,
  DefaultMapControls,
  MapConstructorSettings,
} from '../../ui/map/interfaces/map.interface';
import {
  LayerModel,
  PopupElement,
  PopupElementType,
  UniqueValueInfo,
} from '../../../models/layer.model';
import { IconName } from '../../icon-picker/icon-picker.const';
import { LayerType } from '../../ui/map/interfaces/layer-settings.type';
import { set } from 'lodash';

type Nullable<T> = { [P in keyof T]: T[P] | null };

/** Angular Form Builder */
const fb = new FormBuilder();

/** Default map value */
const DEFAULT_MAP: Nullable<MapConstructorSettings> = {
  title: null,
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
  layers: [],
  controls: DefaultMapControls,
  arcGisWebMap: null,
};

/** Default gradient for heatmap */
const DEFAULT_GRADIENT = [
  {
    color: 'blue',
    ratio: 0,
  },
  {
    color: 'red',
    ratio: 1,
  },
];

/**
 * Create layer form from value
 *
 * @param value layer value ( optional )
 * @returns new form group
 */
export const createLayerForm = (value?: LayerModel) => {
  const type = get(value, 'type', 'FeatureLayer') as LayerType;
  return fb.group({
    // Layer properties
    id: [get(value, 'id', null)],
    type: [type, Validators.required],
    name: [get(value, 'name', null), Validators.required],
    visibility: [get(value, 'visibility', true), Validators.required],
    opacity: [get(value, 'opacity', 1), Validators.required],
    layerDefinition: createLayerDefinitionForm(
      type,
      get(value, 'layerDefinition')
    ),
    ...(type !== 'GroupLayer' && {
      popupInfo: createPopupInfoForm(get(value, 'popupInfo')),
      // Layer datasource
      datasource: createLayerDataSourceForm(get(value, 'datasource')),
    }),
  });
};

/**
 * Create layer data source form group
 *
 * @param value layer data
 * @returns layer data source form group
 */
const createLayerDataSourceForm = (value?: any): FormGroup => {
  const getCanSeeFields = (value: any) => {
    return (
      (get(value, 'resource') || get(value, 'refData')) &&
      (get(value, 'layout') || get(value, 'aggregation'))
    );
  };
  const canSeeFields = getCanSeeFields(value);
  const formGroup = fb.group({
    resource: [get(value, 'resource', null)],
    layout: [get(value, 'layout', null)],
    aggregation: [get(value, 'aggregation', null)],
    refData: [get(value, 'refData', null)],
    geoField: [
      {
        value: get(value, 'geoField', null),
        disabled:
          !canSeeFields ||
          get(value, 'latitudeField') ||
          get(value, 'longitudeField'),
      },
    ],
    latitudeField: [
      {
        value: get(value, 'latitudeField', null),
        disabled: !canSeeFields || get(value, 'geoField'),
      },
    ],
    longitudeField: [
      {
        value: get(value, 'longitudeField', null),
        disabled: !canSeeFields || get(value, 'geoField'),
      },
    ],
  });
  formGroup.valueChanges.subscribe((value) => {
    const canSeeFields = getCanSeeFields(value);
    if (canSeeFields) {
      if (value.geoField) {
        formGroup.get('latitudeField')?.disable({ emitEvent: false });
        formGroup.get('longitudeField')?.disable({ emitEvent: false });
      } else {
        if (value.latitudeField || value.longitudeField) {
          formGroup.get('geoField')?.disable({ emitEvent: false });
        } else {
          formGroup.get('geoField')?.enable({ emitEvent: false });
          formGroup.get('latitudeField')?.enable({ emitEvent: false });
          formGroup.get('longitudeField')?.enable({ emitEvent: false });
        }
      }
    } else {
      formGroup.get('geoField')?.disable({ emitEvent: false });
      formGroup.get('latitudeField')?.disable({ emitEvent: false });
      formGroup.get('longitudeField')?.disable({ emitEvent: false });
    }
  });
  return formGroup;
};

/**
 * Create layer definition form group
 *
 * @param type layer type
 * @param value layer definition
 * @returns layer definition form group
 */
const createLayerDefinitionForm = (type: LayerType, value?: any): FormGroup => {
  const formGroup = fb.group({
    minZoom: [get(value, 'minZoom', 2), Validators.required],
    maxZoom: [get(value, 'maxZoom', 18), Validators.required],
    ...(type !== 'GroupLayer' && {
      drawingInfo: createLayerDrawingInfoForm(get(value, 'drawingInfo')),
      featureReduction: createLayerFeatureReductionForm(
        get(value, 'featureReduction')
      ),
    }),
  });
  if (type !== 'GroupLayer') {
    // Add more conditions there so we subscribe to the type to update the form
    const setTypeListeners = () => {
      formGroup
        .get('drawingInfo.renderer.type')
        ?.valueChanges.subscribe((type: string) => {
          const drawingInfo = { ...formGroup.get('drawingInfo')?.value };
          set(drawingInfo, 'renderer.type', type);
          formGroup.setControl(
            'drawingInfo',
            createLayerDrawingInfoForm(drawingInfo)
          );
          setTypeListeners();
        });
    };
    setTypeListeners();
    formGroup.get('featureReduction.type')?.valueChanges.subscribe((type) => {
      formGroup.setControl(
        'featureReduction',
        createLayerFeatureReductionForm({
          ...formGroup.get('featureReduction')?.value,
          type,
        })
      );
    });
  }
  return formGroup;
};

/**
 * Create layer feature reduction form
 *
 * @param value layer feature reduction
 * @returns layer feature reduction form
 */
export const createLayerFeatureReductionForm = (value: any) => {
  const type = get(value, 'type');
  const formGroup = fb.group({
    type: [type],
    ...(type === 'cluster' && {
      drawingInfo: createLayerDrawingInfoForm(get(value, 'drawingInfo')),
      clusterRadius: get(value, 'clusterRadius', 60),
    }),
  });
  return formGroup;
};

/**
 * Create layer drawing info form
 *
 * @param value layer drawing info
 * @returns layer drawing info form
 */
export const createLayerDrawingInfoForm = (value: any): FormGroup => {
  const type = get(value, 'renderer.type', 'simple');
  const formGroup = fb.group({
    renderer: fb.group({
      type: [type, Validators.required],
      ...(type === 'simple' && {
        symbol: fb.group({
          color: [get(value, 'renderer.symbol.color', ''), Validators.required],
          size: [get(value, 'renderer.symbol.size', 24)],
          style: new FormControl<IconName>(
            get(value, 'renderer.symbol.style', 'location-dot')
          ),
        }),
      }),
      ...(type === 'heatmap' && {
        gradient: [
          get(value, 'gradient', DEFAULT_GRADIENT),
          Validators.required,
        ],
        blur: [get<number>(value, 'renderer.blur', 15), Validators.required],
        radius: [
          get<number>(value, 'renderer.radius', 25),
          Validators.required,
        ],
        minOpacity: [
          get<number>(value, 'renderer.minOpacity', 0.4),
          Validators.required,
        ],
      }),
      ...(type === 'uniqueValue' && {
        defaultLabel: get(value, 'renderer.defaultLabel', 'Other'),
        defaultSymbol: fb.group({
          color: [
            get(value, 'renderer.defaultSymbol.color', ''),
            Validators.required,
          ],
          size: [get(value, 'renderer.defaultSymbol.size', 24)],
          style: new FormControl<IconName>(
            get(value, 'renderer.defaultSymbol.style', 'location-dot')
          ),
        }),
        field1: [get(value, 'renderer.field1', null), Validators.required],
        uniqueValueInfos: fb.array(
          get(value, 'renderer.uniqueValueInfos', []).map(
            (uniqueValueInfo: UniqueValueInfo) =>
              createUniqueValueInfoForm(uniqueValueInfo)
          )
        ),
      }),
    }),
  });
  return formGroup;
};

/**
 * Create unique value form group
 *
 * @param value unique value
 * @returns unique value form group
 */
export const createUniqueValueInfoForm = (value?: any) =>
  fb.group({
    label: [get(value, 'label', ''), Validators.required],
    value: [get(value, 'value', ''), Validators.required],
    symbol: fb.group({
      color: [get(value, 'symbol.color', ''), Validators.required],
      size: [get(value, 'symbol.size', 24)],
      style: new FormControl<IconName>(
        get(value, 'symbol.style', 'location-dot')
      ),
    }),
  });

/**
 * Create popup info form group
 *
 * @param value popup info value
 * @returns popup info form group
 */
export const createPopupInfoForm = (value: any) =>
  fb.group({
    title: get(value, 'title', ''),
    description: get(value, 'description', ''),
    popupElements: fb.array(
      get(value, 'popupElements', []).map((element: PopupElement) =>
        createPopupElementForm(element)
      )
    ),
  });

/**
 * Create popup element form group
 *
 * @param value popup element value
 * @returns popup element form group
 */
export const createPopupElementForm = (value: PopupElement): FormGroup => {
  switch (get(value, 'type', 'fields') as PopupElementType) {
    case 'text': {
      return fb.group({
        type: 'text',
        text: get(value, 'text', ''),
      });
    }
    default:
    case 'fields': {
      return fb.group({
        type: 'fields',
        title: get(value, 'title', ''),
        description: get(value, 'description', ''),
        fields: fb.array(get(value, 'fields', []) ?? []),
      });
    }
  }
};

/**
 * Create layer cluster form from value
 *
 * @param value cluster value ( optional )
 * @returns new form group
 */
export const createClusterForm = (value?: any): FormGroup =>
  fb.group({
    overrideSymbol: [get(value, 'overrideSymbol', false), Validators.required],
    symbol: [get(value, 'symbol ', 'location-dot')],
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
export const createMapWidgetFormGroup = (id: any, value?: any): FormGroup => {
  const formGroup = fb.group({
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
  if (formGroup.get('arcGisWebMap')?.value) {
    formGroup.get('basemap')?.disable({ emitEvent: false });
  }
  formGroup.get('arcGisWebMap')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('basemap')?.disable({ emitEvent: false });
    } else {
      formGroup.get('basemap')?.enable({ emitEvent: false });
    }
  });
  return formGroup;
};
