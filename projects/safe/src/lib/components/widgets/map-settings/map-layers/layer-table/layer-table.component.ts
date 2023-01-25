import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray } from '@angular/forms';

/** Interface for a map layer */
export interface MapLayerI {
  name: string;
  type: string;
  layers: FormArray;
  show: boolean;
  id: string;
}

/**
 * Layer table for Map widget.
 */
@Component({
  selector: 'safe-layer-table',
  templateUrl: './layer-table.component.html',
  styleUrls: ['./layer-table.component.scss'],
})
export class SafeLayerTableComponent implements OnInit {
  @Input() layerList!: any[];
  @Input() deep!: string;
  @Input() id!: string;

  @Input() allGroupsIds!: string[];
  public connectedIds: any[] = [];

  @Output() itemDrop: EventEmitter<CdkDragDrop<MapLayerI[]>>;
  @Output() deleteLayer: EventEmitter<any>;
  @Output() editLayer: EventEmitter<any>;
  @Output() createGroup: EventEmitter<any>;
  @Output() ungroup: EventEmitter<any>;
  @Output() toggleGroup: EventEmitter<any>;

  public displayedColumns = ['name', 'actions'];

  /**
   * Layer table for Map widget.
   */
  constructor() {
    this.itemDrop = new EventEmitter();
    this.deleteLayer = new EventEmitter();
    this.editLayer = new EventEmitter();
    this.createGroup = new EventEmitter();
    this.ungroup = new EventEmitter();
    this.toggleGroup = new EventEmitter();
  }

  public ngOnInit(): void {
    this.connectedIds = this.layerList.map((layer) =>
      layer.id
        ? this.allGroupsIds.filter((id: string) => id !== layer.id)
        : null
    );
  }

  /**
   * Emit delete event
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(deep: string, index: number) {
    this.deleteLayer.emit({ deep, index });
  }

  /**
   * Emit edit event
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to remove
   */
  public onEditLayer(deep: string, index: number) {
    this.editLayer.emit({ deep, index });
  }

  /**
   * Emit create group event
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to remove
   */
  public onCreateGroup(deep: string, index: number) {
    this.createGroup.emit({ deep, index });
  }

  /**
   * Emit ungroup event
   *
   * @param deep Current deep of the selected layer
   * @param index Index of the layer to remove
   */
  public onUngroup(deep: string, index: number) {
    this.ungroup.emit({ deep, index });
  }

  /**
   * Emit drop event
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    this.itemDrop.emit(e);
  }

  /**
   * Emit a toggle group event
   *
   * @param element Element toggled
   */
  onToggleGroupLayer(element: MapLayerI) {
    this.toggleGroup.emit(element);
  }
}
