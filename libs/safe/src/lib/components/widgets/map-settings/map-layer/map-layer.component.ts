import { AfterViewInit, Component, OnInit, SkipSelf } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { createLayerForm } from '../map-forms';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { OverlayLayerTree } from '../../../ui/map/interfaces/map-layers.interface';

import * as L from 'leaflet';
import { createCustomDivIcon } from '../../../ui/map/utils/create-div-icon';
import { DefaultMapControls } from '../../../ui/map/interfaces/map.interface';
import {
  MapSettingsDynamicComponent,
  MapSettingsService,
  TabContentTypes,
} from '../map-settings.service';

/** Layer used to test the component */
const TEST_LAYER: {
  [key: string]: {
    type:
      | 'FeatureCollection'
      | 'Feature'
      | 'Polygon'
      | 'Point'
      | 'MultiPoint'
      | 'LineString'
      | 'MultiLineString'
      | 'MultiPolygon'
      | 'GeometryCollection';
    properties: any;
    geometry: {
      coordinates: Array<number> | Array<Array<number[]>>;
      type:
        | 'FeatureCollection'
        | 'Feature'
        | 'Polygon'
        | 'Point'
        | 'MultiPoint'
        | 'LineString'
        | 'MultiLineString'
        | 'MultiPolygon'
        | 'GeometryCollection';
    };
  };
} = {
  polygon: {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [
        [
          [40.11348234228487, 23.758349944054757],
          [48.178129828595445, 24.533783435928683],
          [48.95401786039133, 45.045564528935415],
          [13.062267296081501, 36.89381558821758],
          [2.6529027332038595, 20.097026832317425],
          [40.11348234228487, 23.758349944054757],
        ],
      ],
      type: 'Polygon',
    },
  },
  point: {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [40.11348234228487, 23.758349944054757],
      type: 'Point',
    },
  },
};

/** Modal for adding and editing map layers */
@Component({
  selector: 'safe-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss'],
})
export class MapLayerComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit, MapSettingsDynamicComponent
{
  public form!: UntypedFormGroup;
  public layer!: any;
  public layerIndex!: number;
  private currentLayer: L.Layer | null = null;
  private layerOptions: any = {};

  // === MAP ===
  public mapSettings: MapConstructorSettings = {
    initialState: {
      viewpoint: {
        center: {
          latitude: 0,
          longitude: 0,
        },
        zoom: 2,
      },
    },
    maxBounds: [
      [-90, -1000],
      [90, 1000],
    ],
    basemap: 'OSM',
    zoomControl: false,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true,
    controls: DefaultMapControls,
  };

  /** @returns the selected layer type */
  public get layerType(): keyof typeof TEST_LAYER | null {
    return this.form.get('type')?.value;
  }
  /** @returns the selected icon with the given style config */
  private get icon(): any | null {
    return createCustomDivIcon({
      ...this.form.get('style')?.value,
      ...{ opacity: this.form.get('opacity')?.value },
    });
  }

  /**
   * Modal for adding and editing map layers
   *
   * @param safeMapLayerService Service needed to create the icon for point type layer
   * @param mapSettingsService MapSettingsService
   */
  constructor(
    private safeMapLayerService: SafeMapLayersService,
    @SkipSelf() private mapSettingsService: MapSettingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setUpLayerListeners();
    this.mapSettingsService.mapSettingsButtons.next([
      {
        value: TabContentTypes.LAYER,
        icon: 'settings',
        label: 'components.widget.settings.map.edit.layerProperties',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null): boolean {
          return currentTab === this.value;
        },
      },
    ]);
    this.mapSettingsService.mapSettingsCurrentTabTitle.next(
      'components.widget.settings.map.layers.add'
    );
  }

  ngAfterViewInit(): void {
    if (this.layerType) {
      this.setUpLayer();
    }
    this.setUpEditLayerListeners();
  }

  /**
   * Set layer editor listener
   */
  setUpLayerListeners() {
    this.mapSettingsService.selectedLayerToEdit$
      .pipe(takeUntil(this.destroy$))
      .subscribe((layer: { layer: any; layerIndex: number } | null) => {
        this.layer = layer?.layer;
        this.layerIndex = layer?.layerIndex ?? -1;
        this.form = createLayerForm(layer?.layer);
      });
  }

  /**
   * Close the map layer editor
   *
   * @param discard Discard the current layer creation/edition
   */
  finishLayerEdition(discard?: string) {
    if (discard) {
      this.mapSettingsService.layerDataToSave.next(null);
    } else {
      const layer = this.layer
        ? this.form.value
        : createLayerForm(this.form.value);
      this.mapSettingsService.layerDataToSave.next({
        layer,
        layerIndex: this.layerIndex,
      });
    }
    // Get back to Layers tab and content
    this.mapSettingsService.mapSettingsCurrentSelectedTabButton.next(
      TabContentTypes.LAYERS
    );
  }

  /**
   * Update layer options
   *
   * @param options new options
   */
  private updateLayerOptions(options?: { [key: string]: any }) {
    this.layerOptions = {
      ...this.layerOptions,
      ...(options && options),
    };
    this.mapSettingsService.updateLayer.next({
      layer: this.currentLayer,
      options: this.layerOptions,
      ...(this.layerType === 'point' && { icon: this.icon }),
    });
  }

  /**
   * Set edit layers listeners.
   */
  private setUpEditLayerListeners() {
    this.form.controls.visibilityRangeStart.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({
          visibilityRange: [value, this.form.controls.visibilityRangeEnd.value],
        });
      });
    this.form.controls.visibilityRangeEnd.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({
          visibilityRange: [
            this.form.controls.visibilityRangeStart.value,
            value,
          ],
        });
      });

    this.form.controls.opacity.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({ opacity: value, fillOpacity: value });
      });

    this.form.controls.name.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updateLayerOptions({ name: value });
      });

    this.form.controls.defaultVisibility.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updateLayerOptions({ visible: value });
      });

    // apply marker style changes
    this.form
      .get('style')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.layerType === 'point') {
          this.updateLayerOptions();
        }
      });
    this.form
      .get('type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.layerType === 'point' || this.layerType === 'polygon')
          this.setUpLayer();
      });
  }

  /**
   * Set ups the new selected layer and also removes the previous one
   */
  private setUpLayer() {
    // If a layer is already applied to the map we first delete it
    if (this.currentLayer) {
      this.mapSettingsService.addOrDeleteLayer.next({
        layerData: {
          layer: this.currentLayer,
          label: this.form.get('name')?.value,
        },
        isDelete: true,
      });
    }
    if (this.layerType) {
      this.currentLayer = L.geoJSON(TEST_LAYER[this.layerType]);

      const defaultLayerOptions = {
        visibilityRange: [
          this.form?.get('visibilityRangeStart')?.value,
          this.form?.get('visibilityRangeEnd')?.value,
        ],
        opacity: this.form?.get('opacity')?.value,
        fillOpacity: this.form?.get('opacity')?.value,
        visible: this.form?.get('defaultVisibility')?.value,
        style: this.form?.get('style')?.value,
      };
      const overlays: OverlayLayerTree = {
        layer: this.currentLayer,
        label: this.form.get('name')?.value,
        options: defaultLayerOptions,
      };

      // Then we use a timeout to add the new layer in order to delete the previous layer if so
      setTimeout(() => {
        this.mapSettingsService.addOrDeleteLayer.next({
          layerData: overlays,
          isDelete: false,
        });
      }, 0);

      this.updateLayerOptions(defaultLayerOptions);
    }
  }
  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  public handleMapEvent(event: MapEvent) {
    if (event) {
      switch (event.type) {
        case MapEventType.ZOOM_END:
          this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
          const visibilityRange = [
            this.form.get('visibilityRangeStart')?.value,
            this.form.get('visibilityRangeEnd')?.value,
          ];
          if (this.currentLayer) {
            this.updateLayerOptions({ visibilityRange });
          }
          break;
        default:
          break;
      }
    }
  }
}
