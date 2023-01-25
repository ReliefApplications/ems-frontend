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
  show: boolean;
  id: string;
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
  public mapId: string;
  public displayedColumns = ['name', 'actions'];
  public tablesId: string[] = [];

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   */
  constructor(private dialog: MatDialog) {
    super();
    this.mapId = this.generateUniqueId();
  }

  ngOnInit(): void {
    this.mapLayers.data = this.layers.value;
    this.form
      .get('layers')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapLayers.data = value;
      });
    this.tablesId = [this.mapId];
    this.getTablesId(this.layers);
  }

  /**
   * Generation of an unique id for the map (in case multiple widgets use map).
   *
   * @param parts Number of parts in the id (separated by dashes "-")
   * @returns A random unique id
   */
  private generateUniqueId(parts: number = 4): string {
    const stringArr: string[] = [];
    for (let i = 0; i < parts; i++) {
      // eslint-disable-next-line no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  /**
   * fill the tablesId with all group layer id that have
   * the show property to true.
   *
   * @param layers An array of layer
   */
  private getTablesId(layers: FormArray): void {
    for (const layer of layers.value) {
      if (layer.type === 'group') {
        if (layer.show) {
          this.tablesId.push(layer.id);
        }
        this.getTablesId(layer.layers);
      }
    }
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
   * @param e Event received from the delete event
   */
  public onDeleteLayer(e: any) {
    const deep = e.deep;
    const index = e.index;
    const deepLayer = this.getLayersAtDeep(deep);
    deepLayer.removeAt(index);
    this.tablesId = [this.mapId];
    this.getTablesId(this.layers);
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
   * @param e Event received from the edit event
   */
  public onEditLayer(e: any) {
    const deep = e.deep;
    const index = e.index;
    const deepLayer = this.getLayersAtDeep(deep);
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, {
        data: deepLayer.at(index).value,
        disableClose: true,
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      deepLayer.at(index).patchValue(result);
    });
  }

  /**
   * Create a Group layer with a layer from the form array
   *
   * @param e Event received from the create group event
   */
  public onCreateGroup(e: any) {
    const deep = e.deep;
    const index = e.index;
    const deepLayer = this.getLayersAtDeep(deep);
    const layer = deepLayer.at(index);
    const id = this.generateUniqueId();
    const newGroup = {
      name: 'layer group', // TODO add translation.
      type: 'group',
      layers: new FormArray([layer]),
      show: true,
      id,
    };
    this.tablesId.push(id);
    deepLayer.removeAt(index);
    deepLayer.insert(index, createLayerForm(newGroup));
  }

  /**
   * Ungroup a layer group from the form array
   *
   * @param e Event received from the ungroup event
   */
  public onUngroup(e: any) {
    const deep = e.deep;
    const index = e.index;
    const deepLayer = this.getLayersAtDeep(deep);
    const layerGroup: FormArray = deepLayer.at(index).get('layers')?.value;
    for (let i = 0; i < layerGroup.length; i++) {
      deepLayer.insert(index + i + 1, layerGroup.at(i));
    }
    deepLayer.removeAt(index);
    this.tablesId = [this.mapId];
    this.getTablesId(this.layers);
  }

  /**
   * Display or hide the layers of a group layer.
   * Also add and remove the id from tablesId.
   *
   * @param element Element toggled
   */
  onToggleGroupLayer(element: MapLayerI) {
    if (element.show) {
      const index = this.tablesId.findIndex((x) => x === element.id);
      this.tablesId.splice(index, 1);
    } else {
      this.tablesId.push(element.id);
    }
    element.show = !element.show;
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    console.log('table id', this.tablesId);
    // Search and get container and previousContainer
    console.log(e.container.id, e.previousContainer.id);
    let previousContainer: FormArray | null;
    if (e.previousContainer.id === this.mapId) {
      previousContainer = this.layers;
    } else {
      previousContainer = this.findGroupFromId(
        this.layers,
        e.previousContainer.id
      );
    }

    const valueToChange = previousContainer?.at(e.previousIndex);

    let container: FormArray | null;
    if (e.previousContainer.id === e.container.id) {
      container = previousContainer;
    } else {
      if (e.container.id === this.mapId) {
        container = this.layers;
      } else {
        container = this.findGroupFromId(
          this.layers,
          e.container.id,
          valueToChange?.value.id
        );
      }
    }

    // container can be null if it is equal to valueToChange.id or if it is a subgroup of valueToChange.
    if (!container || !previousContainer || !valueToChange) {
      return;
    }

    previousContainer.removeAt(e.previousIndex);
    container.insert(e.currentIndex, valueToChange);
  }

  /**
   * Find a group layer from its id
   * only used in onListDrop function
   *
   * @param layers An array of layer
   * @param id Id we are looking for
   * @param parentId Id of the original group
   * @returns The layer group we are looking for
   */
  private findGroupFromId(
    layers: FormArray,
    id: string,
    parentId?: string
  ): FormArray | null {
    for (const layer of layers.value) {
      if (layer.type === 'group' && parentId !== layer.id) {
        if (layer.id === id) {
          return layer.layers;
        } else {
          const recursiveResearch = this.findGroupFromId(layer.layers, id);
          if (recursiveResearch) {
            return recursiveResearch;
          }
        }
      }
    }
    return null;
  }
}
