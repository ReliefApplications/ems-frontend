import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapPropertiesComponent } from './map-properties/map-properties.component';
import { MapLayersComponent } from './map-layers/map-layers.component';
import { MapLayerComponent } from './map-layer/map-layer.component';
import { LayerActionOnMap } from '../../ui/map/interfaces/map-layers.interface';
import { UntypedFormGroup } from '@angular/forms';
import {
  MapConstructorSettings,
  MapEvent,
} from '../../ui/map/interfaces/map.interface';

/**
 * Button types that can be displayed in the
 * They should have an associated component to dynamically load
 */
export enum TabContentTypes {
  PARAMETERS,
  LAYERS,
  LAYER,
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
 * They have to at least implement this interface all the components
 * that want to dynamically render in the map settings component drawer content
 */
export interface MapSettingsDynamicComponent {
  form: UntypedFormGroup;
  mapSettings?: MapConstructorSettings;
  handleMapEvent?: (event: MapEvent) => void;
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
  public selectedLayerToEdit: BehaviorSubject<{
    layer: any;
    layerIndex: number;
  } | null> = new BehaviorSubject<{
    layer: any;
    layerIndex: number;
  } | null>(null);
  public selectedLayerToEdit$ = this.selectedLayerToEdit.asObservable();
  public layerDataToSave: BehaviorSubject<{
    layer: any;
    layerIndex: number;
  } | null> = new BehaviorSubject<{
    layer: any;
    layerIndex: number;
  } | null>(null);
  public layerDataToSave$ = this.layerDataToSave.asObservable();
}
