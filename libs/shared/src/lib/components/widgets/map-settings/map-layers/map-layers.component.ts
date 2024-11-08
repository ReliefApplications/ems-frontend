import { Dialog } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomPortal } from '@angular/cdk/portal';
import { CdkTable } from '@angular/cdk/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { LayerModel } from '../../../../models/layer.model';
import { MapLayersService } from '../../../../services/map/map-layers.service';
import { LayerType } from '../../../ui/map/interfaces/layer-settings.type';
import { MapControls } from '../../../ui/map/interfaces/map.interface';
import { MapComponent } from '../../../ui/map/map.component';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'shared-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent extends UnsubscribeComponent implements OnInit {
  /** Map component */
  @Input() mapComponent?: MapComponent;
  /** Layers */
  @Input() control!: UntypedFormControl;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Reference to cdk table */
  @ViewChild(CdkTable, { static: false }) cdkTable!: CdkTable<LayerModel>;
  /** Current layers */
  public mapLayers: Array<LayerModel> = new Array<LayerModel>();
  /** Table's columns */
  public displayedColumns = ['name', 'actions'];
  /** Loading status */
  public loading = true;

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   * @param mapLayersService Shared map layers service
   */
  constructor(
    private dialog: Dialog,
    private mapLayersService: MapLayersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateLayerList();
  }

  /**
   * Update layer list for Layers tab
   */
  private updateLayerList(): void {
    const layerIds = this.control.value;
    this.mapLayersService
      .getLayers(layerIds)
      .pipe(
        // Sort layers list with the same order as the one in the given layer ids
        map((layers) => {
          const sortedLayers: LayerModel[] = [];
          layerIds.forEach((layerId: string) => {
            const layer = layers.find((l) => layerId === l.id);
            if (layer) {
              sortedLayers.push(layer);
            }
          });
          return sortedLayers;
        })
      )
      .subscribe((layers) => {
        this.mapLayers = layers;
        this.loading = false;
      });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    // this.deleteLayer.emit(this.mapLayers[index].id);
    this.mapLayers.splice(index, 1);
    this.control.setValue(this.mapLayers.map((x) => x.id));
    this.cdkTable.renderRows();
  }

  /**
   * Opens a modal to add a new layer
   *
   * @param type type of layer
   */
  public async onAddLayer(type: LayerType = 'FeatureLayer') {
    const { EditLayerModalComponent } = await import(
      '../edit-layer-modal/edit-layer-modal.component'
    );
    if (this.mapComponent) {
      this.mapComponent.resetLayers();
      this.mapComponent.layers = [];
    }
    const dialogRef = this.dialog.open(EditLayerModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        layer: { type } as LayerModel,
        mapComponent: this.mapComponent,
        mapPortal: this.mapPortal,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.loading = true;
        this.mapLayersService.addLayer(value).subscribe({
          next: (layer) => {
            if (layer) {
              const value = this.control.value;
              this.control.setValue([...value, layer.id]);
              this.mapLayers.push(layer);
            }
          },
          error: (err) => console.error(err),
          complete: () => (this.loading = false),
        });
      } else {
        this.restoreMapSettingsView();
      }
    });
  }

  /**
   * Open dialog to select existing layer.
   */
  public onSelectLayer() {
    // @todo
    const dialogRef = this.dialog.open(AddLayerModalComponent, {
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      if (id) {
        this.onEditLayer(id as string);
      }
    });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param id id of layer to edit
   */
  public onEditLayer(id: string) {
    this.mapLayersService
      .getLayerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (layer) => {
        const { EditLayerModalComponent } = await import(
          '../edit-layer-modal/edit-layer-modal.component'
        );
        if (this.mapComponent) {
          this.mapComponent.resetLayers();
          this.mapComponent.layers = [];
        }
        const dialogRef = this.dialog.open(EditLayerModalComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            layer,
            mapComponent: this.mapComponent,
            mapPortal: this.mapPortal,
          },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            if (value) {
              this.loading = true;
              this.mapLayersService.editLayer(value).subscribe({
                next: (layer) => {
                  if (layer) {
                    const index = this.mapLayers.findIndex((x) => x.id === id);
                    if (index !== -1) {
                      this.mapLayers.splice(index, 1, {
                        ...layer,
                        name: value.name,
                      });
                      this.restoreMapSettingsView();
                    } else {
                      // Selecting a new layer
                      const value = this.control.value;
                      this.control.setValue([...value, layer.id]);
                      this.mapLayers.push(layer);
                    }
                  }
                },
                error: (err) => console.log(err),
                complete: () => (this.loading = false),
              });
            } else {
              this.restoreMapSettingsView();
            }
          });
      });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<LayerModel[]>) {
    moveItemInArray(this.mapLayers, e.previousIndex, e.currentIndex);
    this.mapLayers = [...this.mapLayers];
    const layers = this.mapLayers.map((x) => x.id);
    this.control.setValue(layers, { emitEvent: false });
    const encapsulatedSettings = this.mapComponent?.mapSettingsWithoutLayers;
    // Reset using current layers order
    this.mapComponent?.setupMapLayers(
      {
        layers,
        arcGisWebMap: undefined,
        basemap: undefined,
        controls: encapsulatedSettings?.settings.controls as MapControls,
      },
      true
    );
  }

  /**
   * Restore previous map view
   */
  private restoreMapSettingsView() {
    if (this.mapComponent) {
      const encapsulatedSettings = this.mapComponent.mapSettingsWithoutLayers;
      // Reset the current map view in order to only see the layer on edition
      this.mapComponent.mapSettings = {
        ...encapsulatedSettings.settings,
        layers: this.mapLayers.map((layer) => layer.id),
      };
    }
  }
}
