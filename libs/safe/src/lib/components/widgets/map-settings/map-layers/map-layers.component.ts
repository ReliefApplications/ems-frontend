import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SafeMapLayersService } from '../..../../../../../services/maps/map-layers.service';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { createLayerForm } from '../map-forms';
import { SafeEditLayerModalComponent } from './edit-layer-modal/edit-layer-modal.component';

/** List of available layer types */
export const LAYER_TYPES = ['polygon', 'point', 'heatmap', 'cluster'] as const;
/** Interface for a map layer */
export interface MapLayerI {
  name: string;
  type: (typeof LAYER_TYPES)[number];
  defaultVisibility: boolean;
  opacity: number;
  visibilityRangeStart: number;
  visibilityRangeEnd: number;
  style: {
    color: string;
    size: number;
    icon: string;
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
   * @param dialog service for opening modals
   * @param safeMapLayerService service for map layers
   */
  constructor(
    private dialog: MatDialog,
    private safeMapLayerService: SafeMapLayersService
  ) {
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
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.safeMapLayerService
      .deleteLayer(this.layers.at(index).getRawValue().id)
      .subscribe({
        next: (result) => {
          if (result) {
            this.layers.removeAt(index);
          }
          // Handle errors and snackbar to inform user of successful operation?
        },
      });
  }

  /** Opens a modal to add a new layer */
  public onAddLayer() {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.safeMapLayerService.addLayer(this.form.getRawValue()).subscribe({
        next: (result) => {
          if (result) {
            this.layers.push(createLayerForm(result));
          }
          // Handle errors and snackbar to inform user of successful operation?
        },
      });
    });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param index Index of the layer to edit
   */
  public onEditLayer(index: number) {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, {
        disableClose: true,
        data: this.layers.at(index).value,
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.safeMapLayerService
        .editLayer(
          this.layers.at(index).getRawValue().id,
          this.form.getRawValue()
        )
        .subscribe({
          next: (result) => {
            if (result) {
              this.layers.at(index).patchValue(result);
            }
            // Handle errors and snackbar to inform user of successful operation?
          },
        });
    });
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
