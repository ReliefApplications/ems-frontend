import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { createLayerForm } from '../map-forms';
import { SafeEditLayerModalComponent } from './edit-layer-modal/edit-layer-modal.component';

/** Interface for a map layer */
export interface MapLayerI {
  name: string;
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
   */
  constructor(private dialog: MatDialog) {
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
    this.layers.removeAt(index);
  }

  /** Opens a modal to add a new layer */
  public onAddLayer() {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.layers.push(createLayerForm(result));
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
      this.layers.at(index).patchValue(result);
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
