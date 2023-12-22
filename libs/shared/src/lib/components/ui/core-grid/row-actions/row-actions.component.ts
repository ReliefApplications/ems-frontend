import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Component for grid row actions */
@Component({
  selector: 'shared-grid-row-actions',
  templateUrl: './row-actions.component.html',
  styleUrls: ['./row-actions.component.scss'],
})
export class GridRowActionsComponent {
  // === DATA ===
  /** Item to be shown */
  @Input() item: any;

  // === ACTIONS ===
  /** Actions */
  @Input() actions = {
    update: false,
    delete: false,
    history: false,
    convert: false,
    remove: false,
  };
  /** Event emitter for the action event */
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if the component must be shown */
  get display(): boolean {
    return (
      this.actions.history ||
      this.actions.remove ||
      (this.item.canDelete && this.actions.delete) ||
      (this.item.canUpdate && (this.actions.update || this.actions.convert))
    );
  }
}
