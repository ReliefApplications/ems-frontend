import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapPropertiesComponent } from './map-properties/map-properties.component';
import { MapLayersComponent } from './map-layers/map-layers.component';
import { MapLayerComponent } from './map-layer/map-layer.component';
import { LayerActionOnMap } from '../../ui/map/interfaces/map-layers.interface';
import { LayerClusterComponent } from './map-layer/layer-cluster/layer-cluster.component';
import { LayerFieldsComponent } from './map-layer/layer-fields/layer-fields.component';
import { LayerDatasourceComponent } from './map-layer/layer-datasource/layer-datasource.component';
import { LayerFormT, createLayerForm } from './map-forms';

/**
 * Button types that can be displayed in the
 * They should have an associated component to dynamically load
 */
export enum TabContentTypes {
  PARAMETERS,
  LAYERS,
  LAYER,
  CLUSTER,
  FIELD,
  DATASOURCE,
}

/**
 * Button interface used for map settings drawer
 */
export interface MapSettingsButtons {
  value: TabContentTypes;
  icon: string;
  label: string;
  isSelected: (value: TabContentTypes | null) => boolean;
}

/**
 * Shared authentication service.
 */
@Injectable()
export class MapSettingsService {
  /**
   * Any new component that needs to be integrated in the map settings component
   * through dynamic render should be placed in this record
   */
  public readonly tabContent: Record<TabContentTypes, any> = {
    [TabContentTypes.PARAMETERS]: MapPropertiesComponent,
    [TabContentTypes.LAYERS]: MapLayersComponent,
    [TabContentTypes.LAYER]: MapLayerComponent,
    [TabContentTypes.CLUSTER]: LayerClusterComponent,
    [TabContentTypes.FIELD]: LayerFieldsComponent,
    [TabContentTypes.DATASOURCE]: LayerDatasourceComponent,
  };

  /** Current tab buttons */
  public mapSettingsButtons = new BehaviorSubject<MapSettingsButtons[] | null>(
    null
  );
  /** @returns Current tab buttons as observable */
  get mapSettingsButtons$(): Observable<MapSettingsButtons[] | null> {
    return this.mapSettingsButtons.asObservable();
  }
  /** Current tab title */
  public mapSettingsCurrentTabTitle = new BehaviorSubject<string | null>(null);
  /** @returns Current tab title as observable */
  get mapSettingsCurrentTabTitle$(): Observable<string | null> {
    return this.mapSettingsCurrentTabTitle.asObservable();
  }
  /** Current selected tab button */
  public mapSettingsCurrentSelectedTabButton =
    new BehaviorSubject<TabContentTypes | null>(null);
  /** @returns Current selected tab button as observable */
  get mapSettingsCurrentSelectedTabButton$(): Observable<TabContentTypes | null> {
    return this.mapSettingsCurrentSelectedTabButton.asObservable();
  }

  // === MAP ===
  public addOrDeleteLayer: BehaviorSubject<LayerActionOnMap | null> =
    new BehaviorSubject<LayerActionOnMap | null>(null);
  public layerToAddOrDelete$ = this.addOrDeleteLayer.asObservable();
  public updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateLayer$ = this.updateLayer.asObservable();

  // === MAP LAYER EDITOR ===
  public form: LayerFormT = createLayerForm();

  public selectedLayerToEdit: BehaviorSubject<{
    layer: any;
    layerId: string;
  } | null> = new BehaviorSubject<{
    layer: any;
    layerId: string;
  } | null>(null);
  public selectedLayerToEdit$ = this.selectedLayerToEdit.asObservable();
  public layerDataToSave: BehaviorSubject<{
    layer: any;
    layerId: string;
  } | null> = new BehaviorSubject<{
    layer: any;
    layerId: string;
  } | null>(null);
  public layerDataToSave$ = this.layerDataToSave.asObservable();
}
