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
  Fields,
  LayerModel,
  PopupElement,
  PopupElementType,
  UniqueValueInfo,
} from '../../../models/layer.model';
import {
  GeometryType,
  LayerType,
} from '../../ui/map/interfaces/layer-settings.type';
import { set } from 'lodash';
import { DEFAULT_MARKER_ICON_OPTIONS } from '../../ui/map/utils/create-div-icon';
import { FaIconName, faV4toV6Mapper } from '@oort-front/ui';

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

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Create layer form from value
 *
 * @param value layer value ( optional )
 * @returns new form group
 */
export const createLayerForm = (value?: LayerModel) => {
  const type = get(value, 'type') || 'FeatureLayer';
  const formGroup = fb.group({
    // Layer properties
    id: new FormControl(get(value, 'id', null)),
    type: new FormControl(type, Validators.required),
    name: new FormControl(get(value, 'name', null), Validators.required),
    visibility: new FormControl(
      get(value, 'visibility', true),
      Validators.required
    ),
    opacity: new FormControl(get(value, 'opacity', 1), Validators.required),
    layerDefinition: createLayerDefinitionForm(
      get(value, 'datasource.type') || 'Point',
      type,
      get(value, 'layerDefinition')
    ),
    ...(type !== 'GroupLayer' && {
      popupInfo: createPopupInfoForm(get(value, 'popupInfo')),
      // Layer datasource
      datasource: createLayerDataSourceForm(get(value, 'datasource')),
    }),
    ...(type === 'GroupLayer' && {
      sublayers: new FormControl(get(value, 'sublayers', [])),
    }),

    // TODO: replace when we have a proper UI for this
    contextFilters: new FormControl(
      get(value, 'contextFilters', DEFAULT_CONTEXT_FILTER)
    ),
    at: new FormControl(get(value, 'at', null)),
  });
  if (type !== 'GroupLayer') {
    formGroup.get('datasource.type')?.valueChanges.subscribe((geometryType) => {
      formGroup.setControl(
        'layerDefinition',
        createLayerDefinitionForm(
          geometryType,
          type,
          formGroup.get('layerDefinition')?.value
        ),
        { emitEvent: false }
      );
    });
  }
  return formGroup;
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
      (get(value, 'resource') &&
        (get(value, 'layout') || get(value, 'aggregation'))) ||
      get(value, 'refData')
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
    adminField: [
      {
        value: get(value, 'adminField', null),
        disabled:
          !canSeeFields ||
          get(value, 'latitudeField') ||
          get(value, 'longitudeField'),
      },
    ],
    latitudeField: [
      {
        value: get(value, 'latitudeField', null),
        disabled:
          !canSeeFields ||
          get(value, 'geoField') ||
          get(value, 'type') === 'Polygon',
      },
    ],
    longitudeField: [
      {
        value: get(value, 'longitudeField', null),
        disabled:
          !canSeeFields ||
          get(value, 'geoField') ||
          get(value, 'type') === 'Polygon',
      },
    ],
    type: [get(value, 'type', 'Point')],
  });
  formGroup.valueChanges.subscribe((value) => {
    const canSeeFields = getCanSeeFields(value);
    if (canSeeFields) {
      if (value.geoField || value.type === 'Polygon') {
        formGroup.get('geoField')?.enable({ emitEvent: false });
        formGroup.get('adminField')?.enable({ emitEvent: false });
        formGroup.get('latitudeField')?.disable({ emitEvent: false });
        formGroup.get('longitudeField')?.disable({ emitEvent: false });
      } else {
        if (value.latitudeField || value.longitudeField) {
          formGroup.get('geoField')?.disable({ emitEvent: false });
          formGroup.get('adminField')?.disable({ emitEvent: false });
        } else {
          formGroup.get('geoField')?.enable({ emitEvent: false });
          formGroup.get('adminField')?.enable({ emitEvent: false });
          formGroup.get('latitudeField')?.enable({ emitEvent: false });
          formGroup.get('longitudeField')?.enable({ emitEvent: false });
        }
      }
    } else {
      formGroup.get('geoField')?.disable({ emitEvent: false });
      formGroup.get('adminField')?.disable({ emitEvent: false });
      formGroup.get('latitudeField')?.disable({ emitEvent: false });
      formGroup.get('longitudeField')?.disable({ emitEvent: false });
    }
  });
  return formGroup;
};

/**
 * Create layer definition form group
 *
 * @param geometryType layer geometry type
 * @param type layer type
 * @param value layer definition
 * @returns layer definition form group
 */
const createLayerDefinitionForm = (
  geometryType: GeometryType = 'Point',
  type: LayerType,
  value?: any
): FormGroup => {
  const formGroup = fb.group({
    minZoom: [get(value, 'minZoom', 2), Validators.required],
    maxZoom: [get(value, 'maxZoom', 18), Validators.required],
    ...(type !== 'GroupLayer' && {
      drawingInfo: createLayerDrawingInfoForm(
        get(value, 'drawingInfo'),
        geometryType
      ),
      featureReduction: createLayerFeatureReductionForm(
        geometryType === 'Point' ? get(value, 'featureReduction') : null
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
            createLayerDrawingInfoForm(drawingInfo, geometryType)
          );
          // If new type is heatmap and we currently have a cluster set, reset the featureReduction
          if (
            type === 'heatmap' &&
            formGroup.get('featureReduction.type')?.value === 'cluster'
          ) {
            formGroup.get('featureReduction.type')?.patchValue({ type: null });
          }
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
      clusterRadius: get(value, 'clusterRadius') || 60,
      lightMode: get(value, 'lightMode', false),
      fontSize: get(value, 'fontSize') || 14,
      autoSizeCluster: get(value, 'autoSizeCluster', false),
    }),
  });
  return formGroup;
};

/**
 * Create symbol form for layer
 *
 * @param value layer symbol value
 * @param geometryType layer geometry type
 * @returns layer symbol form
 */
export const createSymbolForm = (
  value: any,
  geometryType: GeometryType = 'Point'
): FormGroup => {
  // If there was any previous configuration using v4 fa icons, we mapped them to the v6 equivalent if so
  // If there is no need, we keep the original value
  const style = get(value, 'style', 'location-dot');
  const styleFinalValue = faV4toV6Mapper[style] ?? style;
  return fb.group({
    color: [
      get(value, 'color', DEFAULT_MARKER_ICON_OPTIONS.color),
      Validators.required,
    ],
    size: [get(value, 'size', 24)],
    style: new FormControl<FaIconName>(styleFinalValue),
    ...(geometryType === 'Polygon' && {
      outline: fb.group({
        color: [
          get(value, 'outline.color', DEFAULT_MARKER_ICON_OPTIONS.color),
          Validators.required,
        ],
        width: [get(value, 'outline.width', 1)],
      }),
    }),
  });
};

/**
 * Create layer drawing info form
 *
 * @param value layer drawing info
 * @param geometryType layer geometry type
 * @returns layer drawing info form
 */
export const createLayerDrawingInfoForm = (
  value: any,
  geometryType: GeometryType = 'Point'
): FormGroup => {
  let type = get(value, 'renderer.type', 'simple');
  // Avoid heatmap to be used if not point
  if (geometryType !== 'Point' && type === 'heatmap') {
    type = 'simple';
  }
  const formGroup = fb.group({
    renderer: fb.group({
      type: [type, Validators.required],
      ...(type === 'simple' && {
        symbol: createSymbolForm(get(value, 'renderer.symbol'), geometryType),
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
        defaultSymbol: createSymbolForm(
          get(value, 'renderer.defaultSymbol'),
          geometryType
        ),
        field1: [get(value, 'renderer.field1', null), Validators.required],
        uniqueValueInfos: fb.array(
          get(value, 'renderer.uniqueValueInfos', []).map(
            (uniqueValueInfo: UniqueValueInfo) =>
              createUniqueValueInfoForm(geometryType, uniqueValueInfo)
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
 * @param geometryType layer geometry type
 * @param value unique value
 * @returns unique value form group
 */
export const createUniqueValueInfoForm = (
  geometryType: GeometryType = 'Point',
  value?: any
) =>
  fb.group({
    label: [get(value, 'label', ''), Validators.required],
    value: [get(value, 'value', ''), Validators.required],
    symbol: createSymbolForm(get(value, 'symbol'), geometryType),
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
    fieldsInfo: fb.array(
      get(value, 'fieldsInfo', []).map((element: Fields) =>
        createFieldsInfoForm(element)
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
 * Create popup fields form group
 *
 * @param value fields info value
 * @returns fields form group
 */
export const createFieldsInfoForm = (value: Fields): FormGroup =>
  fb.group({
    label: get(value, 'label', ''),
    name: get(value, 'name', ''),
    type: get(value, 'type', ''),
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
    // timedimension: [get(value, 'timedimension', false)],
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
