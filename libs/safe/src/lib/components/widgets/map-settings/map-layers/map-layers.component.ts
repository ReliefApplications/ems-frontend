import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { LayerModel } from '../../../../models/layer.model';
import { LayerType } from '../../../ui/map/interfaces/layer-settings.type';

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
  implements OnInit, OnChanges
{
  @ViewChild('layerTable', { static: true }) layerTable!: MatTable<any>;
  @Input() layerIds!: string[];
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  @Output() editLayer = new EventEmitter<LayerModel>();
  @Output() deleteLayer = new EventEmitter<string>();

  // Table
  public mapLayers: MatTableDataSource<LayerModel> = new MatTableDataSource();
  public displayedColumns = ['name', 'actions'];

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   * @param mapLayersService Shared map layers service
   */
  constructor(
    private dialog: MatDialog,
    private mapLayersService: SafeMapLayersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateLayerList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.layerIds) {
      this.layerIds = changes.layerIds.currentValue;
      this.updateLayerList();
    }
  }

  /**
   * Update layer list for Layers tab
   */
  private updateLayerList(): void {
    // todo: add filtering
    this.mapLayersService.getLayers().subscribe((layers) => {
      this.mapLayers.data = layers.filter((x) => this.layerIds.includes(x.id));
    });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.deleteLayer.emit(this.mapLayers.data[index].id);
  }

  /** Opens a modal to add a new layer */
  public onAddLayer(type: LayerType = 'FeatureLayer') {
    this.editLayer.emit({
      type,
    } as LayerModel);
  }

  /**
   * Open dialog to select existing layer.
   */
  public onSelectLayer() {
    const dialogRef = this.dialog.open(AddLayerModalComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((id) => {
      if (id) {
        this.onEditLayer(id);
      }
    });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param id id of layer to edit
   */
  public onEditLayer(id: string) {
    this.mapLayersService.getLayerById(id).subscribe((layer) => {
      this.editLayer.emit(layer);
      // const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      //   this.dialog.open(SafeEditLayerModalComponent, {
      //     disableClose: true,
      //     data: layer,
      //   });

      // dialogRef.afterClosed().subscribe((editedLayer) => {
      //   if (editedLayer) {
      //     this.mapLayersService.editLayer(editedLayer).subscribe((res) => {
      //       if (res) {
      //         // this.layers.at(index).patchValue(res);
      //         this.fetchLayers();
      //       }
      //     });
      //   }
      // });
    });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<LayerModel[]>) {
    moveItemInArray(this.mapLayers.data, e.previousIndex, e.currentIndex);
    this.layerTable.renderRows();
  }
}
