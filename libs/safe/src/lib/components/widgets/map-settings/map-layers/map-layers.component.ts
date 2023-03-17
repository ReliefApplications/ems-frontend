import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SkipSelf } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import {
  MapSettingsDynamicComponent,
  MapSettingsService,
  TabContentTypes,
} from '../map-settings.service';

/** List of available layer types */
export const LAYER_TYPES = ['polygon', 'point', 'heatmap', 'cluster'] as const;
/** Interface for a map layer */
export interface MapLayerI {
  name: string;
  type: (typeof LAYER_TYPES)[number];
}

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent
  extends SafeUnsubscribeComponent
  implements OnInit, MapSettingsDynamicComponent
{
  @Input() form!: UntypedFormGroup;
  /** @returns the form array for the map layers */
  get layers() {
    return this.form.get('layers') as UntypedFormArray;
  }

  // Table
  public mapLayers: MatTableDataSource<MapLayerI> = new MatTableDataSource();
  public displayedColumns = ['name', 'actions'];

  /**
   * Layers configuration component of Map Widget.
   *
   * @param mapSettingsService MapSettingsService
   */
  constructor(@SkipSelf() private mapSettingsService: MapSettingsService) {
    super();
  }

  ngOnInit(): void {
    this.mapLayers.data = this.layers.value;
    this.form
      .get('layers')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapLayers.data = value;
      });
    this.mapSettingsService.mapSettingsCurrentTabTitle.next('common.layers');
    this.mapSettingsService.mapSettingsButtons.next([
      {
        value: TabContentTypes.PARAMETERS,
        icon: 'map',
        label: 'components.widget.settings.map.properties.title',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
      {
        value: TabContentTypes.LAYERS,
        icon: 'layers',
        label: 'common.layers',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
    ]);
    this.setUpLayerEditorListeners();
  }

  /**
   * Get the add/edit layer from the map-layer editor
   */
  private setUpLayerEditorListeners() {
    this.mapSettingsService.layerDataToSave$
      .pipe(takeUntil(this.destroy$))
      .subscribe((layer: { layer: any; layerIndex: number } | null) => {
        if (layer?.layer) {
          // If has a valid index is a layer edition
          if (layer.layerIndex !== -1) {
            this.layers.at(layer.layerIndex).patchValue(layer.layer);
          } else {
            this.layers.push(layer.layer);
          }
        }
      });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.layers.removeAt(index);
  }

  /**
   * Set template to add/edit a layer
   *
   * @param index Index of the layer to edit
   */
  public setLayerEditionTemplate(index?: number) {
    this.mapSettingsService.selectedLayerToEdit.next(
      index ? { layer: this.layers.at(index).value, layerIndex: index } : null
    );
    this.mapSettingsService.mapSettingsCurrentSelectedTabButton.next(
      TabContentTypes.LAYER
    );
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    const movedElement = this.layers.at(e.previousIndex);
    this.layers.removeAt(e.previousIndex);
    this.layers.insert(e.currentIndex, movedElement);
  }
}
