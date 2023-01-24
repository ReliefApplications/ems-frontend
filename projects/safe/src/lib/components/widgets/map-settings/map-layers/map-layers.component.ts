import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { createLayerForm } from '../map-forms';
import { SafeEditLayerModalComponent } from './edit-layer-modal/edit-layer-modal.component';

/** Interface for a map layer */
export interface MapLayerI {
  name: string;
  type: string;
  layers: FormArray;
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
  @Input() form!: FormGroup;

  /** @returns the form array for the map layers */
  get layers() {
    return this.form.get('layers') as FormArray;
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
   * Find the array of layers at the current deep.
   *
   * @param deep Current deep of the selected layer
   * @returns array of layers at the current deep
   */
  private getLayersAtDeep(deep: string): FormArray {
    // remove first element that is always an empty string
    const deepList = deep.split(';');
    deepList.shift();
    let deepLayers = this.layers;
    for (const index of deepList) {
      deepLayers = deepLayers.at(parseInt(index, 10)).value.layers;
    }
    return deepLayers;
  }

  /**
   * Removes a layer from the form array
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(deep: string, index: number) {
    const deepLayer = this.getLayersAtDeep(deep);
    deepLayer.removeAt(index);
  }

  /** Opens a modal to add a new layer */
  public onAddLayer() {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.layers.push(createLayerForm(result));
    });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to edit
   */
  public onEditLayer(deep: string, index: number) {
    const deepLayer = this.getLayersAtDeep(deep);
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, {
        data: deepLayer.at(index).value,
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      deepLayer.at(index).patchValue(result);
    });
  }

  /**
   * Create a Group layer with a layer from the form array
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to group
   */
  public onCreateGroup(deep: string, index: number) {
    const deepLayer = this.getLayersAtDeep(deep);
    const layer = deepLayer.at(index);
    deepLayer.removeAt(index);
    const newGroup = {
      name: 'layer group', // TODO add translation.
      type: 'group',
      layers: new FormArray([layer]),
    };
    deepLayer.insert(index, createLayerForm(newGroup));
    console.log(this.layers);
  }

  /**
   * Ungroup a layer group from the form array
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to group
   */
  public onUngroup(deep: string, index: number) {
    console.log('index group', index);
    const deepLayer = this.getLayersAtDeep(deep);
    const layerGroup: FormArray = this.layers.at(index).get('layers')?.value;
    deepLayer.removeAt(index);
    for (let i = 0; i < layerGroup.length; i++) {
      deepLayer.insert(index + i, layerGroup.at(i));
    }
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
