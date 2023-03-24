import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { IconName } from '../../../icon-picker/icon-picker.const';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { Apollo } from 'apollo-angular';
import { GetLayersQueryResponse, GET_LAYERS } from './graphql/queries';
import { Layer, LAYER_TYPES } from '../../../../models/layer.model';

/** Interface for a map layer */
export interface MapLayerI {
  id: string;
  name: string;
  type: (typeof LAYER_TYPES)[number];
  defaultVisibility: boolean;
  opacity: number;
  visibilityRangeStart: number;
  visibilityRangeEnd: number;
  style: {
    color: string;
    size: number;
    icon: IconName | 'leaflet_default';
  };
  datasource: {
    origin: 'resource' | 'refData';
    resource: string;
    layout: string;
    aggregation: string;
    refData: string;
  };
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
  implements OnInit
{
  @Input() form!: UntypedFormGroup;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  @Output() editLayer = new EventEmitter<Layer>();

  /** @returns the form array for the map layers */
  get layers() {
    return this.form.get('layers') as FormControl<string[]>;
  }

  // Table
  public mapLayers: MatTableDataSource<Layer> = new MatTableDataSource();
  public displayedColumns = ['name', 'actions'];

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   * @param mapLayersService Shared map layers service
   * @param apollo Angular Apollo
   */
  constructor(
    private dialog: MatDialog,
    private mapLayersService: SafeMapLayersService,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    // this.mapLayers.data = this.layers.value;
    this.layers?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.length !== this.layers.value.length) {
          this.fetchLayers();
        }
      });
    this.fetchLayers();
  }

  /**
   * Fetch stored layers in the DB
   */
  private fetchLayers(): void {
    this.apollo
      .query<GetLayersQueryResponse>({
        query: GET_LAYERS,
        variables: {},
      })
      .subscribe((res) => {
        this.mapLayers.data = res.data.layers.filter((x) =>
          this.layers.value.includes(x.id)
        );
      });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.layers.setValue(this.layers.value.splice(index, 1));
  }

  /** Opens a modal to add a new layer */
  public onAddLayer() {
    // const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
    //   this.dialog.open(SafeEditLayerModalComponent, { disableClose: true });

    // dialogRef.afterClosed().subscribe((layer) => {
    //   if (layer) {
    //     this.mapLayersService.addLayer(layer).subscribe({
    //       next: (res) => {
    //         if (res) {
    //           this.layers.setValue([...this.layers.value, res.id]);
    //         }
    //       },
    //     });
    //   }
    // });
    this.editLayer.emit({} as Layer);
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
        this.layers.setValue(this.layers.value.concat(id));
        // this.layers.push(createLayerForm(layer));
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
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    let layerIds = this.layers.value;
    const movedElement = layerIds[e.previousIndex];
    layerIds = layerIds.splice(e.previousIndex, 1, movedElement);
    this.layers.setValue(layerIds);
  }
}
