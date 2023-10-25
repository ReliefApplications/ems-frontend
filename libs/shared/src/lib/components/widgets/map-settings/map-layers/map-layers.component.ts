import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';
import { MapLayersService } from '../../../../services/map/map-layers.service';
import { LayerModel } from '../../../../models/layer.model';
import { LayerType } from '../../../ui/map/interfaces/layer-settings.type';
import { Dialog } from '@angular/cdk/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MapComponent } from '../../../ui/map/map.component';
import { CdkTable } from '@angular/cdk/table';

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'shared-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  @Input() mapComponent?: MapComponent;
  @Input() control!: UntypedFormControl;

  // Display of map
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  @ViewChild(CdkTable, { static: false }) cdkTable!: CdkTable<LayerModel>;
  @Input() destroyTab$!: Subject<boolean>;
  public editingLayer: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Table
  public mapLayers: Array<LayerModel> = new Array<LayerModel>();
  public displayedColumns = ['name', 'actions'];
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

  ngAfterViewInit(): void {
    this.currentMapContainerRef
      .pipe(takeUntil(this.destroyTab$))
      .subscribe((viewContainerRef) => {
        if (viewContainerRef && !this.editingLayer.getValue()) {
          if (viewContainerRef !== this.mapContainerRef) {
            const view = viewContainerRef.detach();
            if (view) {
              this.mapContainerRef.insert(view);
              this.currentMapContainerRef.next(this.mapContainerRef);
            }
          }
        }
      });
    this.editingLayer.pipe(takeUntil(this.destroyTab$)).subscribe((editing) => {
      if (!editing) {
        const currentMapContainerRef = this.currentMapContainerRef.getValue();
        if (
          currentMapContainerRef &&
          currentMapContainerRef !== this.mapContainerRef
        ) {
          const view = currentMapContainerRef.detach();
          if (view) {
            this.mapContainerRef.insert(view);
            this.currentMapContainerRef.next(this.mapContainerRef);
          }
        }
      }
    });
  }

  /**
   * Update layer list for Layers tab
   */
  private updateLayerList(): void {
    // todo: add filtering
    this.mapLayersService.getLayers().subscribe((layers) => {
      const layerIds = this.control.value;
      this.mapLayers = layers
        .filter((x) => layerIds.includes(x.id))
        .sort((a, b) => layerIds.indexOf(a.id) - layerIds.indexOf(b.id));
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
    this.mapComponent?.resetLayers();
    const dialogRef = this.dialog.open(EditLayerModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        layer: { type } as LayerModel,
        currentMapContainerRef: this.currentMapContainerRef,
        editingLayer: this.editingLayer,
        mapComponent: this.mapComponent,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.loading = true;
        this.mapLayersService.addLayer(value).subscribe({
          next: (res) => {
            if (res) {
              const value = this.control.value;
              this.control.setValue([...value, res.id]);
              this.mapLayers.push(res);
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
        this.mapComponent?.resetLayers();
        const dialogRef = this.dialog.open(EditLayerModalComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            layer,
            currentMapContainerRef: this.currentMapContainerRef,
            editingLayer: this.editingLayer,
            mapComponent: this.mapComponent,
          },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            if (value) {
              this.loading = true;
              this.mapLayersService.editLayer(value).subscribe({
                next: (res) => {
                  if (res) {
                    const index = this.mapLayers.findIndex(
                      (layer) => layer.id === id
                    );
                    if (index !== -1) {
                      this.mapLayers.splice(index, 1, {
                        ...res,
                        name: value.name,
                      });
                      this.restoreMapSettingsView();
                    } else {
                      // Selecting a new layer
                      const value = this.control.value;
                      this.control.setValue([...value, res.id]);
                      this.mapLayers.push(res);
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
    // const value = this.formControl.value;
    this.control.setValue(
      this.mapLayers.map((x) => x.id),
      { emitEvent: false }
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
