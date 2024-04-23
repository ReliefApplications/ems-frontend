import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GridActions } from '../models/grid-settings.model';

/** Component for the grid toolbar */
@Component({
  selector: 'shared-grid-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})

/**
 * Custom toolbar that we use in the shared-grid component to interact with the admin features
 */
export class GridToolbarComponent {
  // === DATA ===
  /** Items */
  @Input() items: any[] = [];

  // === ACTIONS ===
  /** Actions */
  @Input() actions: GridActions = {
    update: false,
    delete: false,
    history: false,
    convert: false,
    remove: false,
    mapSelected: false,
  };
  /** Event emitter for the action event */
  @Output() action = new EventEmitter();

  /**
   * Gets a boolean indicating if the toolbar should be displayed.
   *
   * @returns Returns true if toolbar must appear.
   */
  get display(): boolean {
    return (
      this.actions.delete ||
      this.actions.update ||
      this.actions.convert ||
      this.actions.remove ||
      (this.actions.mapSelected ?? false)
    );
  }

  /**
   * Gets a boolean indicating if the grid can be updated.
   *
   * @returns Returns true if the option is available
   */
  get canUpdate(): boolean {
    return !this.items.some((x) => !x.canUpdate);
  }

  /**
   * Gets a boolean indicating if the grid can be deleted.
   *
   * @returns Returns true if the option is available
   */
  get canDelete(): boolean {
    return !this.items.some((x) => !x.canDelete);
  }
}
